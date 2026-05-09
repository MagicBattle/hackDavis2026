function Card ({img, title, description, bgColor, iconColor}) {
    return (
    <div
      className={`
        flex items-center gap-5
        rounded-[28px] border border-purple-100
        px-6 py-6 shadow-sm
        transition hover:-translate-y-1 hover:shadow-md
        ${bgColor}
      `}
    >
      <div
        className={`
          flex h-14 w-14 shrink-0 items-center justify-center
          rounded-2xl text-white
          ${iconColor}
        `}
      >
        {img}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="mt-2 text-base text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default Card;