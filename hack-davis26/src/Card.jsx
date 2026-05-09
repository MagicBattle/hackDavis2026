function Card ({img, title, description}) {
    return (
        <div className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-xl shadow-sm w-full">
            <div className="text-indigo-600">
                {img}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 text-center">{description}</p>
        </div>
    );
}

export default Card;