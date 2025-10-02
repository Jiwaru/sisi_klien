function Home() {
  return (
    <div>
      <Judul />
      <Isi />
    </div>
  );
}

function Judul() {
  return <h1 class="text-3xl font-bold underline">Ini adalah Judul</h1>;
}
function Isi() {
  return <p>Ini adalah isi</p>;
}
export default Home;
