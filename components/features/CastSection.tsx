import Image from "next/image";
import { getMovieCredits, getPosterUrl } from "@/lib/api";
import styles from "./CastSection.module.css";

export async function CastSection({ movieId }: { movieId: number }) {
  const credits = await getMovieCredits(movieId);
  const cast = credits.cast.slice(0, 12);

  if (cast.length === 0) {
    return <p className={styles.empty}>No cast information available.</p>;
  }

  return (
    <div className={styles.grid}>
      {cast.map((member) => (
        <div key={member.id} className={styles.card}>
          <div className={styles.avatar}>
            <Image
              src={getPosterUrl(member.profile_path, "w300")}
              alt={member.name}
              fill
              sizes="100px"
              className={styles.image}
            />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{member.name}</span>
            <span className={styles.character}>{member.character}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CastSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.avatar} skeleton`} />
          <div className={styles.info}>
            <div className="skeleton" style={{ height: "12px", width: "80%" }} />
            <div
              className="skeleton"
              style={{ height: "10px", width: "60%", marginTop: "4px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
