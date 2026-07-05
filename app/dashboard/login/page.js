import { loginAction } from "../../actions";

export default function LoginPage({ searchParams }) {
  return (
    <div className="wrap" style={{ maxWidth: 380, paddingTop: 60 }}>
      <div className="card">
        <div className="form-eyebrow">Dashboard</div>
        <div className="form-title">Log in</div>
        {searchParams?.error && (
          <div style={{ color: "#B4483A", fontSize: 13, marginBottom: 12 }}>
            Wrong password — try again.
          </div>
        )}
        <form action={loginAction}>
          <label className="field">
            <span className="field-label">Password</span>
            <input className="input" type="password" name="password" required autoFocus />
          </label>
          <button type="submit" className="btn-primary">Log in</button>
        </form>
      </div>
    </div>
  );
}
