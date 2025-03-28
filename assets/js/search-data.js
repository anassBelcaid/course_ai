// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-cs241",
    title: "CS241",
    section: "Navigation",
    handler: () => {
      window.location.href = "/course_ai/";
    },
  },{id: "nav-schedule",
          title: "Schedule",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/course_ai/lectures/";
          },
        },{id: "nav-assignments",
          title: "Assignments",
          description: "Course assignments organized by date.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/course_ai/assignments/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/course_ai/projects/";
          },
        },{id: "assignments-ai-fundamentals-project-1",
          title: 'AI Fundamentals Project 1',
          description: "In this assignment, students will implement basic machine learning algorithms and explore fundamental concepts.",
          section: "Assignments",handler: () => {
              window.location.href = "/course_ai/assignments/01_search/";
            },},{id: "assignments-constraints-satisfaction-problems",
          title: 'Constraints Satisfaction Problems',
          description: "Assignement on solving the NQueen using backtracking",
          section: "Assignments",handler: () => {
              window.location.href = "/course_ai/assignments/02_constraints/";
            },},{id: "assignments-multi-agent-search",
          title: 'Multi-Agent Search',
          description: "Assignement on solving adversarial search",
          section: "Assignments",handler: () => {
              window.location.href = "/course_ai/assignments/03_adversarial_searh/";
            },},{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/course_ai/books/the_godfather/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
