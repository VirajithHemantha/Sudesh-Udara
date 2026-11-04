import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";
import { INVITATION, getGuestNameFromUrl } from "./invitation";


const backgroundMusic = "/handawaka-various-artists.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbx6tVTRxM0Fjc10fR0a35PjSjb9JJN-9F7zDpxyJvVMhdZ3A-_rOkAV8x8Cwpeqfp5NLw/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.13.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34 (1).jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.35.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.20.09.jpeg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#61a85c", "#a2c5a0", "#2d5a27", "#3f7a39", "#dcebe1"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(27,67,50,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false }: { isDark?: boolean }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "දින", value: days },
    { label: "පැය", value: hours },
    { label: "මිනිත්තු", value: minutes },
    { label: "තත්පර", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#2d5a27] " : "bg-white "
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 ] rounded-t-full pointer-events-none ${isDark ? "" : ""
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#2d5a27]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white "
                  : "bg-stone-50 text-stone-500 "
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#61a85c]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery() {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#1b4332] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              අපගේ මතක සටහන්
            </span>
            <div className="h-px w-16 bg-[#52b788]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#3f7a39] via-[#2d5a27] to-[#3f7a39] bg-clip-text text-transparent italic leading-none">
            සුන්දර මතක
          </h2>
          <p className="text-[#2d5a27]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            අපගේ ආදර කතාවේ සුන්දරතම මොහොතක් ඔබ සමඟ බෙදා ගැනීමට අප සතුටින් බලා සිටිමු.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(45,90,39,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const guestName = getGuestNameFromUrl();

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        dietaryNotes: "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#fae9cb] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              muted={true}
              playsInline
              preload="auto"
              autoPlay
              loop={!hasStarted}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${!hasStarted ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                }`}
              onEnded={() => setIsOpened(true)}
              onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
            >
              <source src="/intro_video.mp4" type="video/mp4" />
            </video>

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-black/40 backdrop-blur-[2px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-12"
                  >
                    <h2 className="text-4xl md:text-6xl text-[#2d5a27] mb-2 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                      විවාහ ආරාධනයයි
                    </h2>
                    <p className="text-xl md:text-2xl text-[#2d5a27] tracking-[0.3em] drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                      {INVITATION.couple.first} සහ {INVITATION.couple.second}
                    </p>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasStarted(true);

                      if (introVideoRef.current) {
                        introVideoRef.current.loop = false;
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }

                      if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                      }
                    }}
                    className="group relative px-12 py-5 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-[#2d5a27] opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-bold text-white text-sm tracking-[0.35em]">
                      ආරාධනය විවෘත කරන්න
                    </span>
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-[#2d5a27]/80 text-xs tracking-[0.35em]"
                  >
                    ආරම්භ කිරීමට ක්ලික් කරන්න
                  </motion.div>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[30vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="text-3xl md:text-7xl text-[#2d5a27] mb-8 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
                  >
                    විවාහ ආරාධනයයි!
                  </motion.h2>

                  <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="text-3xl md:text-6xl text-[#2d5a27] tracking-[0.3em] font-bold drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] self-start"
                    >
                      {INVITATION.couple.first}
                    </motion.p>

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="text-2xl md:text-4xl text-[#2d5a27]/90 italic drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] my-1"
                    >
                      &
                    </motion.span>

                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="text-3xl md:text-6xl text-[#2d5a27] tracking-[0.4em] font-bold drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] self-end"
                    >
                      {INVITATION.couple.second}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-10 z-[110] px-8 py-3 bg-white/40 backdrop-blur-md text-[#2d5a27] text-xs tracking-[0.35em] rounded-full hover:bg-white/60 transition-all font-bold"
                >
                  ආරාධනයට පිවිසෙන්න
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#2d5a27] hover:bg-emerald-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">වසා දමන්න</div>
              </div>
            </motion.button>

            <section className="w-full relative flex items-start justify-center overflow-hidden bg-transparent min-h-[100dvh] md:min-h-[85vh] pt-20 md:pt-32">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("/ChatGPT%20Image%20Jun%208,%202026,%2002_43_56%20AM.png")` }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-5xl px-6 text-center mt-12 md:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8 }}
                  className="mt-10"
                >
                  <h1 className="text-6xl sm:text-7xl md:text-8xl text-[#2d5a27] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.first}
                  </h1>

                  <div className="mt-6 flex items-center justify-center gap-5">
                    <div className="h-px w-14 bg-[#2d5a27]/40" />
                    <span className="text-4xl md:text-5xl text-[#2d5a27] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold">සහ</span>
                    <div className="h-px w-14 bg-[#2d5a27]/40" />
                  </div>

                  <h1 className="mt-6 text-6xl sm:text-7xl md:text-8xl text-[#2d5a27] italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                    {INVITATION.couple.second}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="mt-4 md:mt-12"
                >
                  <p className="mt-1 md:mt-5 text-[#2d5a27]/70 text-sm md:text-base tracking-[0.15em] font-medium leading-loose max-w-2xl mx-auto">
                    අපගේ ජීවිතයේ අමතක නොවන සුබ මොහොත ඔබ සමඟ බෙදා ගැනීමට කැමැත්තෙමු!
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
              >
                <div className="w-px h-14 bg-gradient-to-b from-[#2d5a27]/30 to-transparent rounded-full overflow-hidden">
                  <motion.div
                    animate={{ y: [-56, 56] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-1/2 bg-[#3f7a39]/45"
                  />
                </div>
              </motion.div>
            </section>

            <section className="relative w-full py-16 md:py-28 px-6 flex flex-col items-center text-center bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto flex flex-col items-center space-y-6"
              >
                <div className="flex items-center gap-4 opacity-50">
                  <div className="h-px w-10 bg-[#2d5a27]" />
                  <Sparkles className="w-4 h-4 text-[#3f7a39]" />
                  <div className="h-px w-10 bg-[#2d5a27]" />
                </div>

                <p className="text-xl md:text-2xl text-[#2d5a27]/80 tracking-[0.3em] font-bold">
                  ආදරණීය
                </p>

                {guestName && (
                  <h2 className="text-4xl md:text-6xl text-[#2d5a27] font-bold italic leading-tight">
                    {guestName}
                  </h2>
                )}

                <p className="text-base md:text-lg text-slate-700 leading-loose">
                  අපගේ ජීවිතයේ සුන්දරතම දිනය අප සමඟ සමරන්නට, ඔබට සෙනෙහසින් ආරාධනා කරමු.
                </p>

                <div className="h-px w-24 bg-[#2d5a27]/25" />

                <p className="text-lg md:text-xl text-[#3f7a39] font-bold tracking-wide">
                  ඔබගේ පැමිණීම අපට මහත් සතුටකි
                </p>
              </motion.div>
            </section>

            <section
              id="details"
              className="relative pt-8 md:pt-20 pb-12 md:pb-32 w-full flex flex-col items-center overflow-hidden"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-4 md:inset-8 ] pointer-events-none z-10" />
              <div className="absolute inset-5 md:inset-10 ] pointer-events-none z-10" />

              <div className="max-w-[1100px] w-full flex flex-col items-center text-center relative z-20 px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-16 space-y-6"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="h-px w-8 bg-[#2d5a27]" />
                    <Sparkles className="w-4 h-4 text-[#3f7a39]" />
                    <div className="h-px w-8 bg-[#2d5a27]" />
                  </div>

                  <div className="text-[#2d5a27] space-y-6 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
                    <p className="text-slate-700">
                      {INVITATION.parents[0]} මහතාගේ සහ මැතිණියගේ ආදරණීය දියණිය
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#3f7a39] my-2">
                      {INVITATION.couple.second}
                    </h3>

                    <p className="text-slate-700">
                      {INVITATION.parents[1]} මහතාගේ සහ මැතිණියගේ ආදරණීය පුතණුවන්
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#3f7a39] my-2">
                      {INVITATION.couple.first}
                    </h3>

                    <p className="text-slate-700 max-w-2xl mx-auto pt-2">
                      සමග අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන්
                      <br />
                      වර්ෂ 2026 ක් වූ දෙසැම්බර් මස 07 වන දින පෙ.ව 9.00 සිට ප.ව 4.00 දක්වා
                      <br />
                      {INVITATION.venue.nameSi} හිදී පැවැත්වෙන ප්‍රිය සම්භාෂණයට සහභාගි වන මෙන්
                    </p>

                    <p className="text-slate-700 font-bold">
                      {guestName ? `${guestName} ` : ""}ඔබට ගෞරවයෙන් ආරාධනා කරමු.
                    </p>

                    <p className="text-slate-600 text-sm md:text-base">
                      (පෝරුව චාරිත්‍රය පෙ.ව 10.13ට)
                    </p>




                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl text-[#3f7a39] tracking-[0.5em] font-bold">
                    ශ්‍රී සුභ මංගලම්
                  </h2>
                </motion.div>

                <div className="relative w-full flex flex-col items-center justify-center my-8 md:my-12 mb-12 md:mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-20 w-full max-w-[560px] bg-gradient-to-b from-white to-[#fcfcfc] p-8 md:p-14 rounded-3xl border border-[#3f7a39]/30 shadow-[0_0_50px_-12px_rgba(45,90,39,0.25)] flex flex-col items-center justify-center text-center overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2d5a27] via-[#52b788] to-[#2d5a27]" />
                    <div className="absolute inset-2 border border-[#3f7a39]/10 rounded-[1.5rem] pointer-events-none" />

                    <div className="w-full text-left grid grid-cols-1 gap-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#3f7a39]/10 flex items-center justify-center shrink-0 border border-[#3f7a39]/20 shadow-inner">
                          <Calendar className="w-5 h-5 text-[#3f7a39]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            දිනය
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            {INVITATION.date.displayLong}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2d5a27]/10 flex items-center justify-center shrink-0 border border-[#2d5a27]/20 shadow-inner">
                          <Clock className="w-5 h-5 text-[#2d5a27]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            වේලාව
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            {INVITATION.time.event}
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold mt-2">
                            {INVITATION.time.poruwa}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2d5a27]/10 flex items-center justify-center shrink-0 border border-[#2d5a27]/20 shadow-inner">
                          <MapPin className="w-5 h-5 text-[#2d5a27]" />
                        </div>
                        <div className="pt-1">
                          <div className="text-xs md:text-[11px] tracking-[0.5em] font-bold text-[#2d5a27]/50 mb-1">
                            ස්ථානය
                          </div>
                          <div className="text-base md:text-lg text-[#2d5a27] tracking-wide font-bold">
                            {INVITATION.venue.nameSi}
                          </div>
                          <a
                            href={INVITATION.venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-[10px] md:text-xs text-[#3f7a39] hover:text-[#1b4332] font-bold tracking-widest uppercase border-b border-[#3f7a39]/30 hover:border-[#1b4332] transition-colors pb-0.5"
                          >
                            සිතියමෙන් බලන්න
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="relative py-14 md:py-48 bg-[#2d5a27] flex flex-col items-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white blur-[100px] rounded-full pointer-events-none"
              />

              <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative mb-12 md:mb-20"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80px" }}
                      viewport={{ once: true }}
                      className="h-px bg-white/40 mb-8"
                    />

                    <h2 className="text-3xl md:text-6xl text-white tracking-[0.25em] md:tracking-[0.4em] font-bold leading-tight">
                      මෙම දිනය <span className="mx-2 md:mx-4 text-[#dcebe1]">සුරකින්න</span>
                    </h2>

                    <div className="mt-10 flex items-center justify-center gap-6">
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#dcebe1]/50" />
                      <span className="font-numeric text-3xl md:text-5xl text-[#dcebe1] drop-shadow-md">
                        {INVITATION.date.displayNumeric}
                      </span>
                      <div className="h-[0.5px] w-8 md:w-16 bg-[#dcebe1]/50" />
                    </div>
                  </div>
                </motion.div>

                <CountdownTimer isDark />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 md:mt-20 flex flex-col items-center gap-4"
                >
                  <p className="text-sm md:text-base tracking-[0.6em] text-white font-bold text-center">
                    ආදරයෙන් පිරුණු මොහොතකට රැඳී සිටින්න
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-1 h-1 bg-[#dcebe1] rotate-45"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>


            <section className="relative py-16 md:py-48 bg-transparent flex flex-col items-center overflow-hidden">
              <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center relative z-10 w-full">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-4xl text-slate-800 tracking-[0.3em] mb-8 md:mb-12 text-center"
                >
                  පැමිණීම තහවුරු කිරීම
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="relative w-full max-w-[650px] bg-white p-6 md:p-10 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.12)] flex flex-col items-center"
                >
                  <div className="w-full rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center">
                    <h3 className="text-2xl md:text-4xl text-slate-800 mb-8 text-center">
                      ඔබ පැමිණෙන්නේද?
                    </h3>

                    <form className="w-full space-y-6 text-left" onSubmit={handleRsvpSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">ඔබගේ නම</label>
                        <input
                          type="text"
                          placeholder="ඔබගේ නම මෙහි ලියන්න..."
                          value={rsvpForm.name}
                          onChange={(e) => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                          }}
                          className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-base font-numeric"
                          required
                        />
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">
                          අපගේ විශේෂ දිනයට ඔබ පැමිණෙන්නේද?
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "1" }));
                          }}
                          aria-pressed={rsvpForm.guests !== "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests !== "0" ? "bg-[#2d5a27] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          ඔව්, මම ආදරයෙන් පැමිණෙන්නම්!
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("idle");
                            setRsvpForm((prev) => ({ ...prev, guests: "0" }));
                          }}
                          aria-pressed={rsvpForm.guests === "0"}
                          className={`w-full py-5 md:py-6 rounded-xl text-sm md:text-base tracking-wide transition-all shadow-sm flex items-center justify-center px-4 leading-relaxed active:scale-[0.98] ${rsvpForm.guests === "0" ? "bg-[#2d5a27] text-white hover:bg-[#1a5c4a]" : "bg-[#f3f3f3] hover:bg-slate-200 text-slate-700"}`}
                        >
                          කණගාටුයි, මට පැමිණිය නොහැක. නමුත් මගේ ආශීර්වාදය ඔබ සමඟයි.
                        </button>
                      </div>

                      {(rsvpStatus === "success" || rsvpStatus === "error") && (
                        <p
                          className={`text-xs text-center font-semibold ${rsvpStatus === "success" ? "text-emerald-600" : "text-red-500"
                            }`}
                        >
                          {rsvpStatus === "success"
                            ? "ඔබගේ පැමිණීම තහවුරු කිරීම සාර්ථකව යවා ඇත."
                            : "කරුණාකර ඔබගේ නම ඇතුළත් කර නැවත උත්සාහ කරන්න."}
                        </p>
                      )}

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "sending"}
                          className="w-full bg-[#2d5a27] text-white py-4 md:py-5 rounded-xl text-sm md:text-base tracking-[0.2em] font-bold hover:bg-[#1a5c4a] transition-all shadow-md disabled:opacity-70"
                        >
                          {rsvpStatus === "sending" ? "යවමින්..." : "තහවුරු කරන්න"}
                        </button>

                        <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed">
                          ඔබගේ ප්‍රතිචාරය පුද්ගලිකව තබා ගනු ලැබේ.
                        </p>
                      </div>
                    </form>
                  </div>
                </motion.div>


              </div>
            </section>






            <section className="w-full relative overflow-hidden bg-transparent py-14 md:py-32">
              <div className="container mx-auto px-6 max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-3 opacity-70">
                    <div className="h-px w-10 bg-[#2d5a27]/20" />
                    <Sparkles className="w-4 h-4 text-[#3f7a39]" />
                    <div className="h-px w-10 bg-[#2d5a27]/20" />
                  </div>

                  <h2 className="text-5xl md:text-7xl bg-gradient-to-r from-[#3f7a39] via-[#2d5a27] to-[#3f7a39] bg-clip-text text-transparent italic">
                    ස්තූතියි
                  </h2>

                  <p className="text-[#2d5a27]/70 text-sm md:text-base tracking-[0.25em] font-medium leading-loose max-w-3xl mx-auto">
                    සෙනෙහසින් ලියැවෙන අපගේ ජීවිත කතාවේ සුන්දරතම දිනය, ඔබගේ පැමිණීමෙන් තවත් අර්ථවත් වනු ඇතැයි අප විශ්වාස කරමු
                  </p>

                  {INVITATION.rsvpContacts.length > 0 && (
                    <div className="pt-6 flex flex-col items-center gap-4 text-center w-full max-w-xl mx-auto">
                      <div className="h-px w-24 bg-[#2d5a27]/20" />
                      <p className="text-slate-500 text-xs tracking-[0.4em] font-bold mt-2">
                        සම්බන්ධතා
                      </p>

                      <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-[#2d5a27]/70 text-base tracking-widest font-normal">
                        {INVITATION.rsvpContacts.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm md:text-base tracking-[0.5em] text-[#2d5a27]/50 font-bold pt-12">
                    © 2026 {INVITATION.couple.first} සහ {INVITATION.couple.second}
                  </p>
                  <p className="text-[#2d5a27]/60 text-xs mt-2 font-sans tracking-wider">
                    Want a beautiful wedding website like this? Create yours with{" "}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3f7a39] font-bold hover:text-[#1b4332] underline underline-offset-2"
                      href="https://wa.me/94707819074"
                    >
                      invitemint
                    </a>
                  </p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#87937a] p-3 rounded-full shadow-lg hover:bg-[#87937a]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}