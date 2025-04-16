
function CardBackground({ children }) {
  return (
    <div className="bg-secondary rounded-lg shadow-md p-6">
      {children}
    </div>
  );
}

export default CardBackground;