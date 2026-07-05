import "./globals.css";

export const metadata = {
  title: "Fieldnote",
  description: "Independent advisory — send a request, get a scoped quote.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar">
          <div className="wordmark">Fieldnote</div>
        </div>
        {children}
      </body>
    </html>
  );
    }
