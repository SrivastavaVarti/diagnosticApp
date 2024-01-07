import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";

const formatDate = (dateString) => {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const BookingListPage = () => {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState("");

  const fetchBookingList = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("frontend blp admin " + token);
      const response = await axios.get(
        `http://localhost:3001/admin/booking-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setBookingList(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("Access Denied. Only admins can view the booking list.");
      } else {
        setError("Error fetching booking list.");
      }
    }
  };

  useEffect(() => {
    fetchBookingList();
  }, []);

  const updateTestStatus = async (bookingId, isDone) => {
    try {
      const token = localStorage.getItem('token');

      // console.log("frontend token BLP uts "+token);
      // console.log("frontend isdn BLP uts "+isDone);

      const response = await axios.put(
        `http://localhost:3001/admin/update-status/${bookingId}`,
        { isDone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchBookingList();
    } catch (error) {
      console.error("Error updating test status:", error);
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className="mt-4">Booking List</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {bookingList.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
                <th>Tests Done</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userId}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.phoneNum}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{booking.time}</td>
                  <td>{booking.address}</td>
                  <td>
                    {booking.isDone === 1
                      ? "Yes"
                      : booking.isDone === 0
                      ? "No"
                      : "Cancelled"}
                  </td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => updateTestStatus(booking.id, 1)}
                      className="btnAdm"
                    >
                      Done
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => updateTestStatus(booking.id, 0)}
                      className="btnAdm"
                    >
                      Not Done
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => updateTestStatus(booking.id, -1)}
                      className="btnAdm"
                    >
                      Cancel Test
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default BookingListPage;
