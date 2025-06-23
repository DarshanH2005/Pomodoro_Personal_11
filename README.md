# Pomodoro Timer Application

A full-featured Pomodoro Timer application built with Next.js and Node.js to boost your productivity.

## Features

- 🍅 Customizable Pomodoro timer with work, short break, and long break sessions
- 📋 Task management with priorities and estimated pomodoros
- 📊 Statistics tracking to monitor your productivity
- ⚙️ Customizable settings (timer durations, auto-start options, notifications)
- 🔔 Desktop notifications and sound alerts
- 🌓 Light/Dark mode support
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

### Timer Controls

- **Start**: Begin the timer for the current session
- **Pause/Resume**: Pause or resume the current timer
- **Stop**: Stop the current timer and reset the time
- **Reset**: Reset the timer and session count
- **Settings**: Customize timer durations, notifications, and more

### Task Management

- Add tasks with title, description, priority, and estimated pomodoros
- Mark tasks as complete
- Edit or delete existing tasks
- Associate tasks with timer sessions

### Statistics

- View daily, weekly, and monthly statistics
- Track completed sessions and focus time
- Monitor task completion rates

## Customization

You can customize various aspects of the Pomodoro Timer through the Settings dialog:

- Work duration (default: 25 minutes)
- Short break duration (default: 5 minutes)
- Long break duration (default: 15 minutes)
- Long break interval (default: after 4 work sessions)
- Auto-start breaks and work sessions
- Notification preferences
- Sound settings
- Theme selection

## Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (for statistics visualization)
- Radix UI (for accessible UI components)

## License

This project is licensed under the MIT License.

## Acknowledgements

- The Pomodoro Technique® is a registered trademark of Francesco Cirillo
- Icons provided by Lucide Icons