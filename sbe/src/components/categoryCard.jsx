import '../styles/categoryCard.css';

export default function CategoryCard({title}) {
    return (
    <div className="category-card">
        <h3 className="category-title">{title}</h3>
        <p className="category-desc">
            Click to explore {title.toLowerCase()} research
        </p>
    </div>
)
}