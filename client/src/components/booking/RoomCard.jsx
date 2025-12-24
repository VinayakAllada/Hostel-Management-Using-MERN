const RoomCard = ({ room, status = "available", isSelected, onSelect }) => {
  const getStatusStyles = () => {
    if (status === "booked") {
      return "border-red-500 bg-red-50 dark:bg-red-600/20 cursor-not-allowed opacity-60";
    } else if (status === "pending") {
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-600/20 cursor-not-allowed opacity-75";
    } else if (isSelected) {
      return "border-blue-500 bg-blue-50 dark:bg-blue-500/20 cursor-pointer shadow-sm";
    } else {
      return "border-green-500 bg-green-50 dark:bg-green-600/20 hover:bg-green-100 dark:hover:bg-green-600/30 cursor-pointer";
    }
  };

  const handleClick = () => {
    if (status === "available") {
      onSelect(room);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-lg p-2 border transition text-center
        ${getStatusStyles()}
      `}
    >
      <h3 className={`font-semibold text-sm ${
        status === "booked" ? "text-red-600 dark:text-red-400" :
        status === "pending" ? "text-yellow-600 dark:text-yellow-400" :
        isSelected ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
      }`}>
        {typeof room === 'string' ? room : room.toString().padStart(3, '0')}
      </h3>

      {isSelected && status === "available" && (
        <p className="text-blue-400 text-xs mt-1">
          ✓
        </p>
      )}
    </div>
  );
};

export default RoomCard;
