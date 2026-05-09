import "./Facts.css";

function Facts({ paragraph }){
    return(
        <div className="fact-card">
            <h1>{paragraph}</h1>
        </div>
    );
}

export default Facts;