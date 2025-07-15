import express from 'express';
import user from './auth/auth.router';
import booking from './bookings/bookings.router';
import payment from './payment/payment.router';
import room from './rooms/rooms.router';
import { SupportTicketsTable } from './Drizzle/schema';
import ticket from './supportTicket/supportTicket.router';
import hotel from './hotels/hotels.router';
import users from './user/user.router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
user(app)
booking(app)
payment(app)
ticket(app)
room(app)
hotel(app)
users(app)


app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
