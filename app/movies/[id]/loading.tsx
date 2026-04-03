import styles from "./page.module.css";

export default function MovieLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.backdropWrapper}>
        <div className="skeleton" style={{ width: "100%", height: "100%" }} />
        <div className={styles.backdropGradient} />
      </div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.breadcrumbRow}>
            <div className="skeleton" style={{ height: "14px", width: "180px" }} />
          </div>
          <div
            className="skeleton"
            style={{
              flexShrink: 0,
              width: "260px",
              aspectRatio: "2/3",
              borderRadius: "12px",
            }}
          />
          <div className={styles.info}>
            <div className="skeleton" style={{ height: "14px", width: "120px", marginBottom: "12px" }} />
            <div className="skeleton" style={{ height: "3rem", width: "80%", marginBottom: "8px" }} />
            <div className="skeleton" style={{ height: "14px", width: "60%", marginBottom: "20px" }} />
            <div className="skeleton" style={{ height: "80px", width: "100%", maxWidth: "680px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
