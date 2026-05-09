function Card ({img, title, description}) {
    return (
        <div className="card">
            <div className="card-img">
                {img}
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

export default Card;