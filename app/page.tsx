import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center px-6 py-20 bg-gray-50">
        <h1 className="text-5xl font-bold mb-4 text-indigo-600">Penjualin</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dirancang untuk membantu bisnis Anda mengelola pelanggan, tim, dan
          alur kerja dengan lebih efektif. Semua dalam satu platform yang mudah
          digunakan.
        </p>
      </section>

      {/* Fitur Utama */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 px-6 py-16 max-w-4xl mx-auto">
        {[
          {
            title: "Manajemen Kontak",
            link: "management-contact",
            desc: "Kelola data pelanggan dengan histori lengkap, tag, dan segmentasi.",
            icon: "👥",
          },
          {
            title: "Pipeline Penjualan",
            link: "pipeline-penjualan",
            desc: "Visualisasikan dan pantau proses penjualan Anda dari prospek hingga closing.",
            icon: "📈",
          },

          {
            title: "Kolaborasi Tim",
            link: "kolaborasi-tim",
            desc: "Berbagi tugas, catatan, dan update pelanggan antar anggota tim.",
            icon: "🤝",
          },
          {
            title: "Laporan & Analitik",
            link: "laporan-analitik",
            desc: "Dapatkan wawasan mendalam tentang kinerja penjualan dan tim.",
            icon: "📊",
          },
        ].map((item, i) => (
          <Link
            href={item.link}
            key={i}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-16 bg-indigo-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          Mulai tingkatkan relasi pelanggan Anda hari ini
        </h2>
        <p className="mb-6">
          Gunakan Penjualin gratis dan nikmati kemudahan CRM modern.
        </p>
        <Link
          href="/sign-up"
          className="px-6 py-3 bg-white text-indigo-600 font-medium rounded hover:bg-gray-100 transition"
        >
          Daftar Gratis
        </Link>
      </section>
    </main>
  );
}
