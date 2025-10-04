import '../styles/categoryCard.css';

export default function CategoryCard({ title, desc }) {
    return (
    <div className="category-card">
        <h3 className="category-title">{title}</h3>
        <p className="category-desc">{desc}</p>
    </div>
)
}