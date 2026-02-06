import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container" style={{ padding: "60px 0" }}>
      <h1 style={{ marginBottom: "10px" }}>404 - Halaman Tidak Ditemukan</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
        Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>
      <Link href="/" className="btn btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
