import Input from "../common/Input";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { CheckCircle2, AlertCircle } from "lucide-react";

const BookingForm = ({
  formData,
  onChange,
  onSubmit,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("BookingForm: Form submitted", formData);
    
    if (!formData.guestRoomNO || !formData.guestRoomNO.trim()) {
      console.log("BookingForm: No room number provided");
      alert("Please enter or select a guest room number");
      return;
    }
    
    console.log("BookingForm: Calling onSubmit handler");
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        Booking Details
      </h2>

      {/* Room Selection Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
          Guest Room Number *
        </label>
        
        {/* Manual Input */}
        <Input
          label=""
          name="guestRoomNO"
          value={formData.guestRoomNO || ""}
          onChange={onChange}
          disabled={loading}
          placeholder="Enter room number (e.g., 101)"
          required
          className="mb-2"
        />
        
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Or select from available rooms below after selecting dates
        </p>
      </div>

      {/* Selected Room Display (if selected from cards) */}
      {formData.guestRoomNO && (
        <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-blue-400 text-sm font-medium">Selected Room</p>
            <p className="text-white font-semibold">Room {formData.guestRoomNO}</p>
          </div>
        </div>
      )}

      <Input
        label="Visitor Name"
        name="visitorName"
        value={formData.visitorName}
        onChange={onChange}
        disabled={loading}
        required
      />

      <Input
        label="Relation"
        name="relation"
        value={formData.relation}
        onChange={onChange}
        disabled={loading}
        placeholder="e.g., Father, Mother, Friend"
        required
      />

      <Input
        label="From Date"
        type="date"
        name="dateFrom"
        value={formData.dateFrom}
        onChange={onChange}
        disabled={loading}
        required
      />

      <Input
        label="To Date"
        type="date"
        name="dateTo"
        value={formData.dateTo}
        onChange={onChange}
        disabled={loading}
        required
      />

      <div className="mt-4">
        <Input
          label="Purpose (Optional)"
          name="purpose"
          value={formData.purpose || ""}
          onChange={onChange}
          disabled={loading}
          placeholder="Reason for visit"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !formData.guestRoomNO}
        className="w-full mt-4 flex justify-center"
      >
        {loading ? <Loader /> : "Book Room"}
      </Button>
    </form>
  );
};

export default BookingForm;
