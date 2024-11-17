export default async function Page() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{
        flex: 0.7, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
      </div>
      <div style={{ flex: 0.3 }}>
        <iframe
          src="https://ssh.gitfile.tech/terminal/"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Terminal"
        />
      </div>
    </div>
  );
}
