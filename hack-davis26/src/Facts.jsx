function Facts({ paragraph, color = "text-green-700 border-green-300" }){
    return(
        <div className={`border rounded-lg px-4 py-2 text-sm font-bold ${color}`}>
            {paragraph}
        </div>
    );
}

export default Facts;