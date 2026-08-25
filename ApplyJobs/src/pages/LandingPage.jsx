import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Grid2X2,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import heroVisual from "../assets/applyjobz-hero-transparent-v3.png";
import dashboardVisual from "../assets/applyjobz-dashboard-ai.jpg";
import applyJobzLogo from "../assets/applyjobz-logo-mark-v2.jpg";
import "../landing.css";

const WHATSAPP_URL =
  "https://wa.me/6285157524492?text=Halo%20Admin%20ApplyJobz%2C%20saya%20tertarik%20untuk%20mendapatkan%20akses%20ApplyJobz.";
const TIKTOK_URL = "https://vt.tiktok.com/ZSVaDfvY9/";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard yang informatif",
    text: "Lihat total lamaran, pipeline aktif, interview, offer, dan conversion rate dalam satu pandangan.",
    tone: "violet",
  },
  {
    icon: Grid2X2,
    title: "Pipeline yang terorganisasi",
    text: "Kelola setiap peluang melalui tampilan tabel atau Kanban dengan 10 tahapan rekrutmen yang jelas.",
    tone: "blue",
  },
  {
    icon: CalendarDays,
    title: "Kalender rekrutmen",
    text: "Simpan jadwal interview, assessment, live coding, follow-up, deadline, hingga onboarding.",
    tone: "coral",
  },
  {
    icon: Clock3,
    title: "Pengingat follow-up",
    text: "Ketahui lamaran yang perlu ditindaklanjuti hari ini, terlambat, atau belum mendapat respons.",
    tone: "amber",
  },
  {
    icon: ListChecks,
    title: "Catatan yang lengkap",
    text: "Simpan kontak recruiter, estimasi gaji, link lowongan, prioritas, tag, serta notes penting.",
    tone: "green",
  },
  {
    icon: ShieldCheck,
    title: "Workspace pribadi",
    text: "Data setiap customer dipisahkan melalui sistem autentikasi dan aturan keamanan Firebase.",
    tone: "navy",
  },
];

const steps = [
  {
    number: "01",
    title: "Dapatkan akun",
    text: "Hubungi admin ApplyJobz untuk membeli akses dan menerima akun personalmu.",
  },
  {
    number: "02",
    title: "Catat lamaran",
    text: "Masukkan perusahaan, posisi, sumber lowongan, kontak, gaji, dan informasi penting lainnya.",
  },
  {
    number: "03",
    title: "Perbarui progres",
    text: "Pindahkan status setiap kali ada respons, assessment, interview, offer, atau keputusan akhir.",
  },
  {
    number: "04",
    title: "Fokus pada langkah berikutnya",
    text: "Pantau jadwal dan pengingat dari dashboard agar tidak ada peluang yang terlewat.",
  },
];

const faqs = [
  [
    "Bagaimana cara mendapatkan akun ApplyJobz?",
    "Klik tombol Hubungi Admin melalui WhatsApp. Setelah pembelian dikonfirmasi, admin akan membuat akun personal dan memberikan informasi login kepadamu.",
  ],
  [
    "Apakah ApplyJobz bisa digunakan di HP?",
    "Ya. Tampilan ApplyJobz dirancang responsif sehingga dapat digunakan melalui laptop, tablet, maupun browser di smartphone.",
  ],
  [
    "Apakah data saya bercampur dengan customer lain?",
    "Tidak. Setiap akun hanya diberikan akses ke data lamaran, agenda, dan aktivitas miliknya sendiri melalui aturan keamanan Firebase.",
  ],
  [
    "Apakah ApplyJobz mengirim notifikasi WhatsApp atau email?",
    "Saat ini pengingat tersedia di dalam dashboard ApplyJobz. Notifikasi otomatis ke WhatsApp, email, atau perangkat belum tersedia.",
  ],
  [
    "Saya sudah memiliki akun. Harus mulai dari mana?",
    "Klik tombol Masuk di bagian atas, lalu tambahkan lamaran pertamamu. Setelah itu gunakan kalender untuk mencatat interview, assessment, atau follow-up.",
  ],
];

function Brand() {
  return (
    <span className="landing-brand">
      <span className="landing-brandmark logo">
        <img src={applyJobzLogo} alt="" aria-hidden="true" />
      </span>
      <span>ApplyJobz</span>
    </span>
  );
}

function ProductPreview() {
  return (
    <figure className="landing-product-image">
      <img
        src={dashboardVisual}
        alt="Visual 3D dashboard ApplyJobz untuk mengelola lamaran kerja"
        loading="lazy"
      />
    </figure>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const appTarget = user ? "/dashboard" : "/login";

  return (
    <div className="landing">
      <header className="landing-nav-wrap">
        <nav className="landing-nav">
          <a href="#top" aria-label="ApplyJobz home"><Brand /></a>
          <div className="landing-nav-links">
            <a href="#features">Fitur</a>
            <a href="#how-it-works">Cara kerja</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="landing-nav-actions">
            <Link className="landing-login-link" to={appTarget}>
              {user ? "Buka Dashboard" : "Masuk"}
            </Link>
            <a className="landing-button primary compact" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Dapatkan Akses <ArrowRight />
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="landing-hero" id="top">
          <div className="landing-hero-copy">
            <div className="landing-pill"><Sparkles /> Career workspace untuk pencari kerja</div>
            <h1>Setiap lamaran punya <span>langkah berikutnya.</span></h1>
            <p>
              Kelola peluang, pantau proses rekrutmen, atur jadwal interview,
              dan tahu kapan harus follow-up—semuanya dalam satu workspace yang tenang.
            </p>
            <div className="landing-hero-actions">
              <a className="landing-button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle /> Hubungi Admin
              </a>
              <a className="landing-button secondary" href="#product-tour">
                Lihat cara kerjanya <ArrowRight />
              </a>
            </div>
            <div className="landing-hero-proof">
              <span><CheckCircle2 /> Data akun terpisah</span>
              <span><CheckCircle2 /> Responsif di semua perangkat</span>
              <span><CheckCircle2 /> Tanpa spreadsheet berantakan</span>
            </div>
          </div>
          <div className="landing-hero-visual">
            <span className="landing-orbit one" />
            <span className="landing-orbit two" />
            <img src={heroVisual} alt="Ilustrasi workspace pencarian kerja ApplyJobz" />
            <div className="landing-float-card response"><TrendingUp /><span><small>Response rate</small><strong>78%</strong></span></div>
            <div className="landing-float-card interview"><CalendarDays /><span><small>Next interview</small><strong>Tomorrow, 10:00</strong></span></div>
          </div>
        </section>

        <section className="landing-trust-strip">
          <span>Dibuat untuk perjalanan kariermu</span>
          <div>
            <b><UsersRound /> Fresh Graduate</b>
            <b><Target /> Active Job Seeker</b>
            <b><TrendingUp /> Career Switcher</b>
            <b><BriefcaseBusiness /> Freelancer</b>
          </div>
        </section>

        <section className="landing-section landing-problem">
          <div className="landing-section-heading centered">
            <span className="landing-kicker">Lebih rapi. Lebih fokus.</span>
            <h2>Mencari kerja sudah menantang.<br />Mengelolanya tidak harus ikut rumit.</h2>
            <p>ApplyJobz menggantikan catatan yang tersebar di chat, notes, dan spreadsheet menjadi satu alur yang mudah dipahami.</p>
          </div>
          <div className="landing-problem-grid">
            <article><span>01</span><strong>Lupa sudah melamar ke mana?</strong><p>Semua perusahaan, posisi, dan sumber lowongan tersimpan rapi.</p></article>
            <article><span>02</span><strong>Bingung menunggu respons?</strong><p>Status dan waktu tunggu setiap lamaran terlihat dengan jelas.</p></article>
            <article><span>03</span><strong>Takut melewatkan jadwal?</strong><p>Interview, assessment, follow-up, dan deadline berada di satu kalender.</p></article>
          </div>
        </section>

        <section className="landing-section landing-product-tour" id="product-tour">
          <div className="landing-section-heading split">
            <div>
              <span className="landing-kicker">Satu pusat kendali</span>
              <h2>Lihat progres pencarian kerjamu dengan lebih jernih.</h2>
            </div>
            <p>Dashboard ApplyJobz mengubah data lamaran menjadi gambaran yang mudah dibaca, sehingga kamu tahu apa yang bergerak dan apa yang perlu diperhatikan.</p>
          </div>
          <ProductPreview />
        </section>

        <section className="landing-section landing-features" id="features">
          <div className="landing-section-heading centered">
            <span className="landing-kicker">Semua yang kamu butuhkan</span>
            <h2>Bukan hanya tempat mencatat lamaran.</h2>
            <p>Setiap fitur dirancang untuk membuat proses pencarian kerja lebih terukur, konsisten, dan tidak melelahkan.</p>
          </div>
          <div className="landing-feature-grid">
            {features.map(({ icon: Icon, title, text, tone }) => (
              <article key={title}>
                <span className={`landing-feature-icon ${tone}`}><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="landing-feature-check"><CheckCircle2 /> Tersedia di ApplyJobz</span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-pipeline-section">
          <div className="landing-section landing-pipeline-inner">
            <div className="landing-section-heading split light">
              <div>
                <span className="landing-kicker">Ikuti setiap perkembangan</span>
                <h2>Dari menemukan lowongan sampai menerima pekerjaan.</h2>
              </div>
              <p>Sepuluh status membantu kamu mencatat perjalanan setiap peluang tanpa kehilangan konteks.</p>
            </div>
            <div className="landing-pipeline">
              {[
                ["Saved", "Lowongan ditemukan"],
                ["Applied", "Lamaran dikirim"],
                ["Screening", "Seleksi awal"],
                ["Assessment", "Tes kemampuan"],
                ["Interview", "Tahap wawancara"],
                ["Offer", "Penawaran diterima"],
                ["Accepted", "Langkah baru dimulai"],
              ].map(([status, description], index) => (
                <div key={status} className={status === "Accepted" ? "success" : ""}>
                  <span>{index + 1}</span><strong>{status}</strong><small>{description}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-how" id="how-it-works">
          <div className="landing-section-heading centered">
            <span className="landing-kicker">Mulai tanpa ribet</span>
            <h2>Empat langkah menuju job search yang terorganisasi.</h2>
          </div>
          <div className="landing-steps">
            {steps.map((step, index) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                {index < steps.length - 1 && <ArrowRight />}
              </article>
            ))}
          </div>
          <div className="landing-how-cta">
            <div><MessageCircle /><span><strong>Siap menata perjalanan kariermu?</strong><small>Chat langsung dengan admin untuk mendapatkan akses.</small></span></div>
            <a className="landing-button primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Mulai lewat WhatsApp <ExternalLink /></a>
          </div>
        </section>

        <section className="landing-section landing-faq" id="faq">
          <div className="landing-faq-intro">
            <span className="landing-kicker">Pertanyaan umum</span>
            <h2>Masih ada yang ingin kamu ketahui?</h2>
            <p>Temukan jawaban singkat tentang akses, keamanan data, dan cara menggunakan ApplyJobz.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Tanya langsung ke admin <ArrowRight /></a>
          </div>
          <div className="landing-faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span>+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="landing-section landing-final-cta">
          <div>
            <span className="landing-kicker">Your career command center</span>
            <h2>Peluang terbaikmu layak dikelola dengan serius.</h2>
            <p>Mulai catat, pantau, dan tindak lanjuti setiap lamaran bersama ApplyJobz.</p>
            <div>
              <a className="landing-button white" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle /> Dapatkan Akses</a>
              <Link className="landing-button ghost" to={appTarget}>{user ? "Buka Dashboard" : "Saya sudah punya akun"} <ArrowRight /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <Brand />
          <p>Workspace yang tenang untuk pekerjaan di balik pencarian kerja.</p>
        </div>
        <div>
          <strong>Jelajahi</strong>
          <a href="#features">Fitur</a>
          <a href="#how-it-works">Cara kerja</a>
          <a href="#faq">FAQ</a>
        </div>
        <div>
          <strong>Terhubung</strong>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp <ExternalLink /></a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer">TikTok <ExternalLink /></a>
        </div>
        <div className="landing-footer-bottom">
          <span>© {new Date().getFullYear()} ApplyJobz. All rights reserved.</span>
          <Link to="/login">Masuk ke aplikasi</Link>
        </div>
      </footer>
    </div>
  );
}
