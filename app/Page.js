import { submitRequestAction } from "./actions";

const SERVICES = [
  { id: "strategy", label: "Strategy Session", blurb: "A focused working session to untangle a specific decision." },
  { id: "audit", label: "Process Audit", blurb: "A structured review of how work currently moves through your team." },
  { id: "retainer", label: "Ongoing Advisory", blurb: "Ongoing access for a set number of hours each month." },
  { id: "other", label: "Something else", blurb: "Describe it below and I'll scope it with you." },
];

export default function HomePage() {
  return (
    <div className="wrap">
      <section className="hero">
        <div className="hero-eyebrow">Independent advisory · replies within one business day</div>
        <h1 className="hero-title">Tell me the problem.<br />I'll send back a plan and a price.</h1>
        <p className="hero-sub">
          Every engagement starts as a short written request. You describe the work, I reply with a
          scoped quote, and nothing is booked until you accept it.
        </p>
      </section>

      <section className="services-row">
        {SERVICES.map((s) => (
          <div key={s.id} className="service-card">
            <div className="service-label">{s.label}</div>
            <div className="service-blurb">{s.blurb}</div>
          </div>
        ))}
      </section>

      <section className="card">
        <div className="form-eyebrow">Start a request</div>
        <div className="form-title">What are you working on?</div>

        <form action={submitRequestAction}>
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Your name</span>
              <input className="input" name="name" required placeholder="Jordan Lee" />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input className="input" name="email" type="email" required placeholder="jordan@company.com" />
            </label>
            <label className="field">
              <span className="field-label">Service</span>
              <select className="input" name="service" defaultValue={SERVICES[0].id}>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Rough budget (optional)</span>
              <input className="input" name="budget" placeholder="$1,500–$3,000" />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Describe what you need</span>
            <textarea
              className="input"
              name="message"
              required
              minLength={10}
              placeholder="What's the situation, and what would a good outcome look like?"
            />
          </label>

          <button type="submit" className="btn-primary">Send request</button>
          <div className="form-footer">No payment yet — you'll only pay if you accept the quote.</div>
        </form>
      </section>
    </div>
  );
    }
