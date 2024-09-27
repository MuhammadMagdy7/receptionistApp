# Visit Management System

This is a Visit Management System built with Next.js, React, and Redux. It allows users to manage visits, organizations, and people efficiently. The application supports role-based access for receptionists and managers.

## Features

- **Role-based Access Control**: Different views and permissions for receptionists and managers.
- **Visit Management**: Add, update, and delete visits.
- **Organization and People Management**: Manage organizations and associated people.
- **Real-time Updates**: Uses WebSockets for real-time updates across clients.
- **Notifications**: Utilizes `react-hot-toast` for user notifications.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Redux**: A state management library for JavaScript apps.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Socket.io**: A library for real-time web applications.
- **MongoDB**: A NoSQL database for storing data.
- **Mongoose**: An ODM for MongoDB and Node.js.
- **react-hot-toast**: A library for notifications.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB instance running locally or in the cloud.

### Installation

1. **Clone the repository:**

bash
git clone https://github.com/MuhammadMagdy7/receptionistApp.git
cd receptionistApp


2. **Install dependencies:**

bash
npm install


3. **Set up environment variables:**

   Rename `.env.example` to `.env.local` and add values to variables:
4. **Set up the accounts :**
bash
node scripts/createUsers.js

5. **Run the development server:**

bash
npm run dev


   The application will be available at `http://localhost:3000`.

## Usage

- **Receptionist Role**: Can add, update, and delete visits, organizations, and people.
- **Manager Role**: Can view and update the status of visits.

## Project Structure

- **/app**: Contains the main application pages and components.
- **/components**: Reusable React components.
- **/lib**: Contains utility functions and Redux setup.
- **/models**: Mongoose models for MongoDB collections.
- **/pages/api**: API routes for handling server-side logic.
- **/public**: Static files such as images and icons.
- **/styles**: Global styles and Tailwind CSS configuration.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the creators of Next.js, React, Redux, and all the libraries used in this project.