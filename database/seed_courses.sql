-- =========================================================
-- SEED DATA - 8 SAMPLE COURSES FOR DEVELOPMENT
-- =========================================================
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from Supabase Auth

INSERT INTO courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  instructor_name,
  platform,
  affiliate_link,
  original_price,
  discounted_price,
  currency,
  duration_hours,
  level,
  category,
  language,
  rating,
  students_count,
  what_you_learn,
  requirements,
  tags,
  is_featured,
  is_published,
  sort_order
) VALUES 

-- Course 1: Web Development Bootcamp (Featured)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'The Complete 2024 Web Development Bootcamp',
  'complete-2024-web-development-bootcamp',
  'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, JavaScript, Node, React, MongoDB, and More!',
  'Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.7 average, my Web Development course is one of the HIGHEST RATED courses in the history of Udemy!

At 65+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery. Here''s why:

The course is taught by the lead instructor at the App Brewery, London''s leading in-person programming bootcamp.

The course has been updated to be 2024 ready and you''ll be learning the latest tools and technologies used at large companies such as Apple, Google and Netflix.

This course doesn''t cut any corners, there are beautiful animated explanation videos and tens of challenging coding exercises and projects.

By the end of this course, you will be fluently programming and be ready to make any website you can dream of.',
  'https://picsum.photos/seed/course1/1200/675',
  'Dr. Angela Yu',
  'Udemy',
  'https://www.udemy.com/course/the-complete-web-development-bootcamp/?referralCode=YOUR_AFFILIATE_CODE',
  199.99,
  14.99,
  'USD',
  65.5,
  'Beginner',
  'Web Development',
  'English',
  4.7,
  850000,
  ARRAY[
    'Build 16 web development projects for your portfolio, ready to apply for junior developer jobs',
    'Learn the latest technologies, including Javascript, React, Node and Web3 Development',
    'After the course you will be able to build ANY website you want',
    'Build fully-fledged websites and web apps for your startup or business',
    'Master frontend development with React',
    'Master backend development with Node',
    'Learn professional developer best practices'
  ],
  ARRAY[
    'No programming experience needed - I''ll teach you everything you need to know',
    'A Mac or PC computer with access to the internet',
    'No paid software required',
    'I''ll walk you through, step-by-step how to get all the software installed and set up'
  ],
  ARRAY['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'MongoDB', 'Full Stack', 'Web3'],
  true,
  true,
  1
),

-- Course 2: React - The Complete Guide (Featured)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'React - The Complete Guide 2024 (incl. React Router & Redux)',
  'react-complete-guide-2024',
  'Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and way more!',
  'Join the most comprehensive and bestselling React course on Udemy and learn all about this amazing and popular library from the ground up - in great depth!

This course is fully up-to-date with React 18 and introduces you to React step-by-step. From the basics to advanced concepts - this course has it all. You''ll learn React by building real projects!

After finishing this course, you will:
- Have a solid understanding of React and modern JavaScript
- Be able to build real React applications
- Understand and use advanced React concepts and patterns
- Know how to use React Router, Redux and other third-party libraries
- Be able to debug React apps efficiently',
  'https://picsum.photos/seed/course2/1200/675',
  'Maximilian Schwarzmüller',
  'Udemy',
  'https://www.udemy.com/course/react-the-complete-guide/?referralCode=YOUR_AFFILIATE_CODE',
  189.99,
  13.99,
  'USD',
  52.0,
  'Intermediate',
  'Web Development',
  'English',
  4.8,
  625000,
  ARRAY[
    'Build powerful, fast, user-friendly and reactive web apps',
    'Provide amazing user experiences by leveraging the power of JavaScript with ease',
    'Apply for high-paid jobs or work as a freelancer in one the most-demanded sectors you can find in web dev right now',
    'Learn all about React Hooks and React Components',
    'Learn how to use Redux and React Router',
    'Build SPAs (Single Page Applications) with React.js'
  ],
  ARRAY[
    'JavaScript + HTML + CSS fundamentals are absolutely required',
    'ES6+ JavaScript knowledge is recommended but not a must-have',
    'NO prior React or any other JS framework experience is required!'
  ],
  ARRAY['React', 'Redux', 'React Router', 'Hooks', 'JavaScript', 'Frontend', 'SPA'],
  true,
  true,
  2
),

-- Course 3: Node.js Bootcamp (Featured)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Node.js, Express, MongoDB & More: The Complete Bootcamp 2024',
  'nodejs-express-mongodb-bootcamp-2024',
  'Master Node by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more)',
  'Hi! Welcome to the Complete Node.js, Express, and MongoDB Bootcamp, the only course you need to learn Node.js and start building scalable and fast REST APIs and web applications!

This is a project-based course where you will learn Node.js by building a real-world application, step-by-step. This complete bootcamp is all you need to go from a complete beginner to an advanced and confident Node.js developer.

What will you learn?

- Node.js fundamentals: modules, async programming, event loop, streams, etc.
- Modern JavaScript: arrow functions, promises, async/await, ES6 modules, etc.
- Express in-depth: routing, middleware, error handling, server-side rendering, etc.
- MongoDB fundamentals and Mongoose
- Authentication with JWT: login, signup, password reset, secure cookies
- Security best practices
- Payments with Stripe
- Sending emails & uploading files
- Deploying your apps to production',
  'https://picsum.photos/seed/course3/1200/675',
  'Jonas Schmedtmann',
  'Udemy',
  'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/?referralCode=YOUR_AFFILIATE_CODE',
  199.99,
  15.99,
  'USD',
  42.0,
  'Intermediate',
  'Backend',
  'English',
  4.8,
  340000,
  ARRAY[
    'Master the entire modern back-end stack: Node, Express, MongoDB and Mongoose',
    'Build a complete, beautiful & real-world application from start to finish (API and website)',
    'Build a fast, scalable, feature-rich RESTful API',
    'Learn how to perform CRUD operations with MongoDB and Mongoose',
    'Deep dive into advanced Mongoose features',
    'Learn how NoSQL databases work',
    'CRUD operations, sorting, pagination, filtering',
    'Security: encryption, sanitization, rate limiting, etc.',
    'Credit card payments with Stripe'
  ],
  ARRAY[
    'You should be comfortable with JavaScript',
    'Knowing about promises or async/await is helpful',
    'No Node.js or back-end knowledge required'
  ],
  ARRAY['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'API', 'Backend', 'REST'],
  true,
  true,
  3
),

-- Course 4: Python for Data Science
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Python for Data Science and Machine Learning Bootcamp',
  'python-data-science-machine-learning-bootcamp',
  'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more!',
  'Are you ready to start your path to becoming a Data Scientist!

This comprehensive course will be your guide to learning how to use the power of Python to analyze data, create beautiful visualizations, and use powerful machine learning algorithms!

Data Scientist has been ranked the number one job on Glassdoor and the average salary of a data scientist is over $120,000 in the United States according to Indeed! Data Science is a rewarding career that allows you to solve some of the world''s most interesting problems!

This course is designed for both beginners with some programming experience or experienced developers looking to make the jump to Data Science!',
  'https://picsum.photos/seed/course4/1200/675',
  'Jose Portilla',
  'Udemy',
  'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/?referralCode=YOUR_AFFILIATE_CODE',
  194.99,
  16.99,
  'USD',
  25.0,
  'Intermediate',
  'Data Science',
  'English',
  4.6,
  520000,
  ARRAY[
    'Use Python for Data Science and Machine Learning',
    'Use Spark for Big Data Analysis',
    'Implement Machine Learning Algorithms',
    'Learn to use NumPy for Numerical Data',
    'Learn to use Pandas for Data Analysis',
    'Learn to use Matplotlib for Python Plotting',
    'Learn to use Seaborn for statistical plots',
    'Use Plotly for interactive dynamic visualizations',
    'Use Scikit-Learn for Machine Learning Tasks'
  ],
  ARRAY[
    'Some programming experience is recommended',
    'Access to a computer with an internet connection'
  ],
  ARRAY['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow'],
  false,
  true,
  4
),

-- Course 5: Flutter & Dart
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Flutter & Dart - The Complete Guide [2024 Edition]',
  'flutter-dart-complete-guide-2024',
  'A Complete Guide to the Flutter SDK & Flutter Framework for building native iOS and Android apps',
  'Join the most comprehensive & bestselling Flutter course and learn how to build amazing iOS and Android apps!

You don''t need to learn Android/Java and iOS/Swift to build real native mobile apps!

Flutter - a framework developed by Google - allows you to learn one language (Dart) and build beautiful native mobile apps in no time. Flutter is a SDK providing the tooling to compile Dart code into native code and it also gives you a rich set of pre-built and pre-styled UI elements (so called widgets) which you can use to compose your user interfaces!

This course will teach you Flutter & Dart from scratch, NO prior knowledge of either of the two is required! And you certainly don''t need any Android or iOS development experience since the whole idea behind Flutter is to only learn one language.',
  'https://picsum.photos/seed/course5/1200/675',
  'Maximilian Schwarzmüller',
  'Udemy',
  'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/?referralCode=YOUR_AFFILIATE_CODE',
  189.99,
  14.99,
  'USD',
  44.5,
  'Beginner',
  'Mobile Development',
  'English',
  4.7,
  285000,
  ARRAY[
    'Build native mobile apps with Flutter for both iOS and Android',
    'Learn the latest Dart features',
    'Learn how to use all the key Flutter widgets',
    'Build engaging and beautiful UIs',
    'Handle user input and work with forms',
    'Connect your Flutter apps to backend servers',
    'Leverage device features like the camera',
    'Add Google Maps to your apps',
    'Use Firebase services'
  ],
  ARRAY[
    'NO iOS or Android development experience is required',
    'NO Flutter or Dart knowledge is required',
    'Basic programming language knowledge is helpful but not required'
  ],
  ARRAY['Flutter', 'Dart', 'Mobile Development', 'iOS', 'Android', 'Cross-Platform'],
  false,
  true,
  5
),

-- Course 6: Docker & Kubernetes
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Docker & Kubernetes: The Complete Guide',
  'docker-kubernetes-complete-guide',
  'Build, test, and deploy Docker applications with Kubernetes while learning production-style development workflows',
  'Both Docker and Kubernetes are huge topics on their own. This is the only course on Udemy that covers both of these topics in depth, showing you how they can be used together to make development and deployment of complex applications simple and hassle-free.

The topics covered in this course are applicable to every single application you will ever work on. Docker and Kubernetes are going to be used on every project you work on moving forward - whether you are a developer, DevOps engineer, or product manager.

In this course, you will:
- Learn Docker from scratch, no previous experience required
- Master Kubernetes from the ground up
- Build a CI/CD pipeline with Travis CI
- Automatically deploy your code when it is pushed to GitHub
- Build a complex multi-container application from scratch
- Deploy a workflow to Amazon Web Services',
  'https://picsum.photos/seed/course6/1200/675',
  'Stephen Grider',
  'Udemy',
  'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/?referralCode=YOUR_AFFILIATE_CODE',
  199.99,
  15.99,
  'USD',
  22.0,
  'Intermediate',
  'DevOps',
  'English',
  4.7,
  195000,
  ARRAY[
    'Learn Docker from scratch, no previous experience required',
    'Master the Docker CLI to inspect and debug running containers',
    'Understand how Docker works behind the scenes',
    'Build your own custom images tailored to your applications',
    'Build a CI + CD pipeline from scratch with Github, Travis CI, and AWS',
    'Understand Kubernetes from the ground up',
    'Deploy a production-ready Kubernetes cluster',
    'Handle production traffic with the Ingress controller'
  ],
  ARRAY[
    'Basic understanding of how web applications work',
    'Familiarity with command line interfaces',
    'No Docker or Kubernetes knowledge required'
  ],
  ARRAY['Docker', 'Kubernetes', 'DevOps', 'AWS', 'CI/CD', 'Containerization', 'Microservices'],
  false,
  true,
  6
),

-- Course 7: UI/UX Design
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'User Experience Design Essentials - Adobe XD UI UX Design',
  'user-experience-design-essentials-adobe-xd',
  'Learn User Experience Design from scratch. Adobe XD, Figma, & more. Become a UI UX Designer today!',
  'This UI UX Design course is a fully comprehensive course from scratch covering User Experience, User Interface, User Interaction, and UX Design theory including all of the latest features and updates in the latest version of Adobe XD and Figma!

Every exercise is a real world example that you can follow to create an amazing portfolio and demonstrate your skills to potential employers or clients. No design or technical experience necessary! All you need is a passion for learning and creating.

By taking this course, you will:
- Master Adobe XD and Figma
- Understand the fundamentals of UI/UX Design
- Create wireframes and prototypes
- Conduct user research
- Create a design system
- Build your portfolio
- Work with teams using cloud documents',
  'https://picsum.photos/seed/course7/1200/675',
  'Daniel Walter Scott',
  'Udemy',
  'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/?referralCode=YOUR_AFFILIATE_CODE',
  194.99,
  13.99,
  'USD',
  13.5,
  'Beginner',
  'Design',
  'English',
  4.6,
  142000,
  ARRAY[
    'Master Adobe XD and Figma',
    'Design beautiful and functional user interfaces',
    'Create interactive prototypes',
    'Conduct user research and testing',
    'Build a professional UX design portfolio',
    'Understand design theory and best practices',
    'Work with design systems and components',
    'Collaborate with developers effectively'
  ],
  ARRAY[
    'No design experience necessary',
    'A Mac or PC with Adobe XD installed (free)',
    'Basic computer skills'
  ],
  ARRAY['UI/UX', 'Adobe XD', 'Figma', 'Design', 'Prototyping', 'User Research', 'Wireframing'],
  false,
  true,
  7
),

-- Course 8: AWS Certified Solutions Architect
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'AWS Certified Solutions Architect - Associate 2024',
  'aws-certified-solutions-architect-associate-2024',
  'Pass the AWS Certified Solutions Architect Associate Certification. Complete Amazon Web Services Cloud training!',
  'The AWS Certified Solutions Architect Associate exam is one of the most challenging exams. With a pass rate of less than 50%, students need a comprehensive course to help them prepare for the exam.

This course is continuously updated with new content based on the latest exam version and student feedback!

What makes this course different from the others?

1. This course is taught by a real AWS Certified Solutions Architect Professional
2. The course is regularly updated with new content
3. Practice exams are included
4. Hands-on labs are included
5. You''ll learn by doing, not just watching videos

After taking this course, you will be ready to pass the AWS Certified Solutions Architect Associate exam and start your career in cloud computing!',
  'https://picsum.photos/seed/course8/1200/675',
  'Stephane Maarek',
  'Udemy',
  'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/?referralCode=YOUR_AFFILIATE_CODE',
  199.99,
  16.99,
  'USD',
  27.0,
  'Intermediate',
  'DevOps',
  'English',
  4.7,
  780000,
  ARRAY[
    'Pass the AWS Certified Solutions Architect Associate Certification',
    'Master the AWS fundamentals (EC2, S3, RDS, etc.)',
    'Understand AWS networking and security',
    'Learn database services on AWS',
    'Understand serverless computing with Lambda',
    'Deploy and manage applications on AWS',
    'Design resilient and scalable architectures',
    'Understand AWS pricing and billing'
  ],
  ARRAY[
    'Basic understanding of how websites work',
    'Willingness to learn about cloud computing',
    'No AWS experience required'
  ],
  ARRAY['AWS', 'Cloud Computing', 'Solutions Architect', 'Certification', 'DevOps', 'Infrastructure'],
  false,
  true,
  8
);

-- =========================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Replace 'YOUR_USER_ID_HERE' with your actual user_id from Supabase auth.users
-- 2. Update affiliate_link values with your real affiliate codes
-- 3. You can update thumbnail_url with better images later
-- =========================================================
