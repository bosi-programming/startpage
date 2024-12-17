import colors from 'tailwindcss/colors';

const { lightBlue, warmGray, trueGray, coolGray, blueGray, ...restColors } = colors;

const thulian = "#df6da9";
const pink = "#e791bf";
const green = "#1e2d2f";

export default {
  content: ['./index.html', './src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      ...restColors,
      transparent: "transparent",
      current: "currentColor",
      green,
      emerald: "#0d9263",
      pink,
      peach: "#f7dba7",
      thulian,
      black: "#2f3032",
      gray: {
        15: "#212529",
        68: "#aeaeae",
        93: "#eeeeee",
      },
      white: "#ffffff",
      "primary-on-light": "#246347",
      "secondary-on-light": thulian,
      "primary-on-dark": "#81d8d0",
      "secondary-on-dark": pink,
      success: "#14662d",
      error: "#741427",
      warning: "#c2530a",
      info: "#3a5683",
      "background-on-dark": green,
      "background-on-light": "#fdf5e5",
      "nav-background-on-dark": "#2E4649",
      "nav-background-on-light": "#E8E1D3",
    },
    fontSize: {
      body: 16,
      h1: 40,
      h2: 32,
      h3: 24,
      h4: 20,
      details: 14,
    },
    extend: {
      boxShadow: {
        profile: '0px 4px 4px 8px rgba(65, 65, 65, 0.25)',
        'profile-dark': '0px 4px 4px 8px rgba(83, 96, 98, 0.25)',
        card: '4px 4px 4px rgba(121, 121, 121, 0.4)',
        'card-dark': '4px 4px 4px rgba(255, 255, 255, 0.4)',
        paper: '4px 4px 4px rgba(91, 91, 91, 0.25)',
        'paper-dark': '4px 4px 4px rgba(255, 255, 255, 0.25)',
      },
      screens: {
        sm: "400px",
      },
      gridTemplateColumns: {
        'about-hero': '60% 40%',
      },
    },
  },
  plugins: [],
};
