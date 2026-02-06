import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Movie = {
  id?: string | number;
  detailPath?: string;
  poster?: string;
  posterUrl?: string;
  title?: string;
  rating?: string | number;
  year?: string | number;
  type?: string;
};

type MovieCardProps = {
  movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const detailSlug = movie.detailPath ? encodeURIComponent(movie.detailPath) : "";
  const posterSrc = movie.posterUrl || movie.poster || "/placeholder-poster.svg";
  return (
    <Link href={`/detail/${detailSlug}`} className="movieCard">
      <div className="posterWrapper">
        <Image
          src={posterSrc}
          alt={movie.title || "Poster"}
          className="posterImage"
          width={300}
          height={450}
          sizes="(max-width: 600px) 45vw, (max-width: 900px) 30vw, (max-width: 1200px) 20vw, 200px"
          loading="lazy"
        />
        <div className="ratingBadge">
          <Star size={12} fill="#fbbf24" stroke="none" />
          {movie.rating}
        </div>
        <div className="overlay">
          <h3 className="movieTitle">{movie.title}</h3>
          <div className="movieInfo">
            <span>{movie.year}</span>
            <span>{movie.type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
