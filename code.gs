/**
 * Sudesh & Udara — Wedding RSVP (Google Apps Script Web App)
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1dc2nN3AFYrevt8OgHv7_DppCaFV--CORsM0PakwbylE/edit
 *
 * Website section → sheet
 *   "පැමිණීම තහවුරු කිරීම" (RSVP form)  →  sheet "RSVP"
 *   Summary counts                         →  sheet "Summary" (built automatically)
 *
 * The website sends (POST, form-encoded):
 *   action     = "rsvp"
 *   name       = name typed in the form (pre-filled from the invite link)
 *   attending  = "yes" | "no"
 *   guests     = "1" (attending) | "0" (not attending)   ← kept for older builds
 *   invitedAs  = guest name decoded from the /i/<code> invite link ("" if none)
 *   link       = full page URL the guest opened
 *
 * A guest who submits again (same name, or same invite link) updates their
 * existing row instead of adding a duplicate.
 */

const SPREADSHEET_ID = "1dc2nN3AFYrevt8OgHv7_DppCaFV--CORsM0PakwbylE";
const RSVP_SHEET_NAME = "RSVP";
const SUMMARY_SHEET_NAME = "Summary";
const TIME_ZONE = "Asia/Colombo";

const RSVP_HEADERS = [
  "Timestamp",
  "Name (ඔබගේ නම)",
  "Attendance (සහභාගීත්වය)",
  "Invited As (ආරාධිත නම)",
  "Invite Link",
  "Updated Count",
];

/* ------------------------------------------------------------------ */
/* Entry points                                                        */
/* ------------------------------------------------------------------ */

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  // Lets you open the Web App URL in a browser to check it is live.
  const params = (e && e.parameter) || {};
  if (!params.action) {
    return jsonResponse_({ ok: true, message: "Sudesh & Udara RSVP endpoint is running" });
  }
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "rsvp") {
      return jsonResponse_(saveRsvp_(params));
    }

    return jsonResponse_({ ok: false, message: "Invalid action" });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected error",
    });
  }
}

/* ------------------------------------------------------------------ */
/* RSVP section                                                        */
/* ------------------------------------------------------------------ */

function saveRsvp_(params) {
  const name = clean_(params.name, 120);
  const invitedAs = clean_(params.invitedAs, 120);
  const link = clean_(params.link, 500);

  if (!name) {
    return { ok: false, message: "Name is required" };
  }

  const attending = parseAttending_(params);
  const attendanceLabel = attending ? "පැමිණේ (Attending)" : "නොපැමිණේ (Not attending)";

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_(RSVP_SHEET_NAME);
    ensureRsvpHeader_(sheet);

    const now = new Date();
    let rowIndex = findExistingRow_(sheet, name, invitedAs);
    const isUpdate = rowIndex > 0;

    if (isUpdate) {
      const updates = Number(sheet.getRange(rowIndex, 6).getValue() || 0) + 1;
      sheet
        .getRange(rowIndex, 1, 1, RSVP_HEADERS.length)
        .setValues([[now, name, attendanceLabel, invitedAs, link, updates]]);
    } else {
      sheet.appendRow([now, name, attendanceLabel, invitedAs, link, 0]);
      rowIndex = sheet.getLastRow();
    }

    styleRow_(sheet, rowIndex, attending);
    updateSummary_();

    return { ok: true, updated: isUpdate, message: isUpdate ? "RSVP updated" : "RSVP saved" };
  } finally {
    lock.releaseLock();
  }
}

function parseAttending_(params) {
  const attending = String(params.attending || "").trim().toLowerCase();
  if (attending === "yes" || attending === "true") return true;
  if (attending === "no" || attending === "false") return false;
  return String(params.guests || "1").trim() !== "0";
}

/** Match an earlier reply by invite link name first, then by typed name. */
function findExistingRow_(sheet, name, invitedAs) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const values = sheet.getRange(2, 2, lastRow - 1, 3).getValues(); // name, attendance, invitedAs
  const key = normalise_(name);
  const invitedKey = normalise_(invitedAs);

  for (var i = values.length - 1; i >= 0; i--) {
    var rowName = normalise_(values[i][0]);
    var rowInvited = normalise_(values[i][2]);
    if (invitedKey && rowInvited === invitedKey) return i + 2;
    if (!invitedKey && rowName === key) return i + 2;
  }
  return -1;
}

/* ------------------------------------------------------------------ */
/* Summary sheet                                                       */
/* ------------------------------------------------------------------ */

function updateSummary_() {
  const rsvp = getSheet_(RSVP_SHEET_NAME);
  const summary = getSheet_(SUMMARY_SHEET_NAME);

  const lastRow = rsvp.getLastRow();
  var yes = 0;
  var no = 0;

  if (lastRow >= 2) {
    const values = rsvp.getRange(2, 3, lastRow - 1, 1).getValues();
    values.forEach(function (row) {
      if (String(row[0]).indexOf("නොපැමිණේ") === 0) no++;
      else if (row[0]) yes++;
    });
  }

  summary.clear();
  summary.getRange(1, 1, 5, 2).setValues([
    ["සුදේශ් සහ උදාරා — RSVP Summary", ""],
    ["පැමිණේ (Attending)", yes],
    ["නොපැමිණේ (Not attending)", no],
    ["මුළු ප්‍රතිචාර (Total replies)", yes + no],
    ["Last updated", Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm")],
  ]);
  summary.getRange(1, 1).setFontWeight("bold").setFontSize(13).setFontColor("#2d5a27");
  summary.getRange(2, 1, 3, 1).setFontWeight("bold");
  summary.getRange(2, 2).setFontColor("#2d5a27").setFontWeight("bold");
  summary.getRange(3, 2).setFontColor("#b42318").setFontWeight("bold");
  summary.setColumnWidth(1, 260);
  summary.setColumnWidth(2, 160);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureRsvpHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(RSVP_HEADERS);
  sheet
    .getRange(1, 1, 1, RSVP_HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#2d5a27")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 220);
  sheet.setColumnWidth(5, 320);
  sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
}

function styleRow_(sheet, rowIndex, attending) {
  sheet
    .getRange(rowIndex, 1, 1, RSVP_HEADERS.length)
    .setBackground(attending ? "#e8f3e6" : "#fdecea");
}

function clean_(value, maxLength) {
  var text = String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  // Stop values being interpreted as spreadsheet formulas.
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text.slice(0, maxLength);
}

function normalise_(value) {
  return String(value || "").replace(/^'/, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});
  const contents = e && e.postData && e.postData.contents ? String(e.postData.contents).trim() : "";

  if (!contents) return params;
  if (contents.charAt(0) === "{") return Object.assign(params, JSON.parse(contents));
  return Object.assign(params, parseFormEncoded_(contents));
}

function parseFormEncoded_(raw) {
  const result = {};
  String(raw || "")
    .split("&")
    .forEach(function (pair) {
      if (!pair) return;
      var parts = pair.split("=");
      var key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
      var value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
      if (key) result[key] = value;
    });
  return result;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run once from the editor (▶ Run → setup) to create and format the sheets. */
function setup() {
  ensureRsvpHeader_(getSheet_(RSVP_SHEET_NAME));
  updateSummary_();
}
