-- =====================================================
-- COURSES SEED DATA WITH VIDEOS (UPSERT VERSION)
-- =====================================================
-- This will INSERT new courses or UPDATE existing ones with matching slugs
-- Video URLs are set to NULL - you can upload your own through the admin interface
-- Replace '7a03d529-f20f-4430-be7e-d1a7a8720f29' with your actual user UUID from auth.users
-- You can get it by running: SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Course 1: Web Development Bootcamp (Featured)
INSERT INTO public.courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  promo_video_url,
  gallery_images,
  lesson_videos,
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
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29'::uuid,
  'The Complete Web Development Bootcamp 2024',
  'complete-web-development-bootcamp-2024',
  'Master full-stack web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 20+ real-world projects.',
  'Become a full-stack web developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps. This is the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.8 average, my Web Development course is one of the HIGHEST RATED courses in the history of Udemy! At 65+ hours, this Web Development course is without a doubt the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery.',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop',
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop'
  ],
  NULL,
  'Dr. Angela Yu',
  'Udemy',
  'https://www.udemy.com/course/the-complete-web-development-bootcamp/?referralCode=EXAMPLE123',
  199.99,
  14.99,
  'USD',
  65.5,
  'Beginner',
  'Web Development',
  'English',
  4.8,
  850000,
  ARRAY[
    'Build 20+ web development projects for your portfolio',
    'Master front-end development with HTML5, CSS3, and JavaScript',
    'Learn React and build modern single-page applications',
    'Understand Node.js and Express for backend development',
    'Work with databases using PostgreSQL and MongoDB',
    'Deploy your applications to production',
    'Build RESTful APIs and understand Web3 concepts',
    'Get hired as a junior web developer'
  ],
  ARRAY[
    'No programming experience needed - I''ll teach you everything',
    'A computer with internet connection',
    'Basic English understanding',
    'Willingness to learn and practice coding'
  ],
  ARRAY['Web Development', 'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Full Stack', 'MongoDB'],
  true,
  true,
  1
)
ON CONFLICT (slug) 
DO UPDATE SET
  promo_video_url = EXCLUDED.promo_video_url,
  gallery_images = EXCLUDED.gallery_images,
  lesson_videos = EXCLUDED.lesson_videos,
  thumbnail_url = EXCLUDED.thumbnail_url,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- Course 2: Python Data Science & Machine Learning (Featured)
INSERT INTO public.courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  promo_video_url,
  gallery_images,
  lesson_videos,
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
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29'::uuid,
  'Python for Data Science and Machine Learning',
  'python-data-science-machine-learning',
  'Learn Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, TensorFlow, and more! Master data analysis and ML.',
  'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more! This comprehensive course will be your guide to learning how to use the power of Python to analyze data, create beautiful visualizations, and use powerful machine learning algorithms! Data Scientist has been ranked the number one job on Glassdoor and the average salary of a data scientist is over $120,000 in the United States according to Indeed!',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=675&fit=crop',
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop'
  ],
  NULL,
  'Jose Portilla',
  'Udemy',
  'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/?referralCode=MLPYTHON456',
  194.99,
  13.99,
  'USD',
  48.0,
  'Intermediate',
  'Data Science',
  'English',
  4.7,
  520000,
  ARRAY[
    'Use Python for Data Science and Machine Learning',
    'Implement Machine Learning Algorithms',
    'Learn to use NumPy for Numerical Data',
    'Learn to use Pandas for Data Analysis',
    'Learn to use Matplotlib for Python Plotting',
    'Learn to use Seaborn for statistical plots',
    'Use Scikit-Learn for Machine Learning Tasks',
    'K-Means Clustering, Decision Trees, Random Forests'
  ],
  ARRAY[
    'Basic Python programming knowledge recommended',
    'High school level mathematics',
    'A computer with internet connection',
    'Jupyter Notebook installed (free)'
  ],
  ARRAY['Python', 'Data Science', 'Machine Learning', 'NumPy', 'Pandas', 'TensorFlow', 'AI'],
  true,
  true,
  2
)
ON CONFLICT (slug) 
DO UPDATE SET
  promo_video_url = EXCLUDED.promo_video_url,
  gallery_images = EXCLUDED.gallery_images,
  lesson_videos = EXCLUDED.lesson_videos,
  thumbnail_url = EXCLUDED.thumbnail_url,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- Course 3: UI/UX Design Masterclass
INSERT INTO public.courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  promo_video_url,
  gallery_images,
  lesson_videos,
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
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29'::uuid,
  'Complete UI/UX Design Bootcamp with Figma',
  'complete-ui-ux-design-figma',
  'Master UI/UX design from scratch. Learn Figma, design thinking, wireframing, prototyping, and land your first design job.',
  'Learn User Experience Design, User Interface Design, and all the skills you need to become a professional UI/UX designer. This is the only UX design course you need. My Complete UI/UX Design course teaches you the skills you need to become a professional designer. You will learn User Interface and User Experience design, Figma, prototyping, mobile and web design, and everything else you need to get hired.',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop',
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=600&fit=crop'
  ],
  NULL,
  'Daniel Schifano',
  'Udemy',
  'https://www.udemy.com/course/complete-ui-ux-designer/?referralCode=UXDESIGN789',
  189.99,
  12.99,
  'USD',
  42.0,
  'Beginner',
  'Design',
  'English',
  4.9,
  385000,
  ARRAY[
    'Master Figma and create professional UI designs',
    'Understand UX research and design thinking',
    'Create wireframes and prototypes',
    'Design for mobile and web applications',
    'Learn typography, color theory, and visual hierarchy',
    'Build a professional design portfolio',
    'Conduct user testing and iterate designs',
    'Get hired as a UI/UX designer'
  ],
  ARRAY[
    'No design experience required',
    'A computer (Mac or Windows)',
    'Free Figma account',
    'Creativity and willingness to learn'
  ],
  ARRAY['UI Design', 'UX Design', 'Figma', 'Prototyping', 'Design Thinking', 'Web Design', 'Mobile Design'],
  false,
  true,
  3
)
ON CONFLICT (slug) 
DO UPDATE SET
  promo_video_url = EXCLUDED.promo_video_url,
  gallery_images = EXCLUDED.gallery_images,
  lesson_videos = EXCLUDED.lesson_videos,
  thumbnail_url = EXCLUDED.thumbnail_url,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- Course 4: Digital Marketing Mastery (Featured)
INSERT INTO public.courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  promo_video_url,
  gallery_images,
  lesson_videos,
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
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29'::uuid,
  'The Complete Digital Marketing Course - 12 Courses in 1',
  'complete-digital-marketing-course',
  'Master digital marketing strategy, social media marketing, SEO, YouTube, email, Facebook marketing, analytics & more!',
  'Learn digital marketing strategy, social media marketing, SEO, YouTube, email, Facebook, Google Ads & analytics. The #1 rated digital marketing course on Udemy! Learn how to market a business online with 12 courses in 1. Taught by a former marketing director. This course covers everything you need to know about digital marketing. Learn social media marketing, search engine optimization, email marketing, copywriting, content marketing and much more.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop',
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop'
  ],
  NULL,
  'Rob Percival',
  'Udemy',
  'https://www.udemy.com/course/learn-digital-marketing-course/?referralCode=MARKETING101',
  199.99,
  11.99,
  'USD',
  55.5,
  'All Levels',
  'Marketing',
  'English',
  4.6,
  680000,
  ARRAY[
    'Master social media marketing on Facebook, Instagram, LinkedIn',
    'Grow your email list and create email marketing campaigns',
    'Build a complete SEO strategy and rank on Google',
    'Master YouTube marketing and grow your channel',
    'Create Google Ads and Facebook Ads campaigns',
    'Understand marketing analytics and Google Analytics',
    'Build a professional marketing strategy',
    'Get hired as a digital marketer or grow your business'
  ],
  ARRAY[
    'No marketing experience needed',
    'Basic computer skills',
    'Internet connection',
    'Willingness to implement what you learn'
  ],
  ARRAY['Digital Marketing', 'SEO', 'Social Media', 'Facebook Ads', 'Google Ads', 'Email Marketing', 'Analytics'],
  true,
  true,
  4
)
ON CONFLICT (slug) 
DO UPDATE SET
  promo_video_url = EXCLUDED.promo_video_url,
  gallery_images = EXCLUDED.gallery_images,
  lesson_videos = EXCLUDED.lesson_videos,
  thumbnail_url = EXCLUDED.thumbnail_url,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- Course 5: AWS Solutions Architect Associate
INSERT INTO public.courses (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  thumbnail_url,
  promo_video_url,
  gallery_images,
  lesson_videos,
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
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29'::uuid,
  'AWS Certified Solutions Architect Associate (SAA-C03)',
  'aws-solutions-architect-associate',
  'Pass the AWS Solutions Architect exam! Learn Cloud Computing, EC2, S3, IAM, VPC, Route 53, RDS, Lambda, and more.',
  'Welcome to the AWS Certified Solutions Architect Associate course! The AWS Solutions Architect Associate certification is one of the most in-demand IT certifications in the industry. This course will teach you everything you need to pass the SAA-C03 exam and become an AWS Certified Solutions Architect. You will learn all the AWS services needed to design and deploy scalable, highly available systems on AWS.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop',
  NULL,
  ARRAY[
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop'
  ],
  NULL,
  'Stephane Maarek',
  'Udemy',
  'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/?referralCode=AWSCERT567',
  179.99,
  13.99,
  'USD',
  38.5,
  'Intermediate',
  'Cloud Computing',
  'English',
  4.8,
  745000,
  ARRAY[
    'Pass the AWS Solutions Architect Associate exam',
    'Master core AWS services: EC2, S3, RDS, Lambda',
    'Design scalable and fault-tolerant systems on AWS',
    'Understand AWS networking with VPC and Route 53',
    'Implement security with IAM and encryption',
    'Deploy applications using CloudFormation',
    'Monitor systems with CloudWatch',
    'Get hired as an AWS Solutions Architect'
  ],
  ARRAY[
    'Basic understanding of IT concepts',
    'Basic networking knowledge recommended',
    'No AWS experience needed',
    'Access to an AWS account (free tier available)'
  ],
  ARRAY['AWS', 'Cloud Computing', 'Solutions Architect', 'EC2', 'S3', 'Lambda', 'DevOps', 'Certification'],
  false,
  true,
  5
)
ON CONFLICT (slug) 
DO UPDATE SET
  promo_video_url = EXCLUDED.promo_video_url,
  gallery_images = EXCLUDED.gallery_images,
  lesson_videos = EXCLUDED.lesson_videos,
  thumbnail_url = EXCLUDED.thumbnail_url,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- =====================================================
-- IMPORTANT: Replace '7a03d529-f20f-4430-be7e-d1a7a8720f29' with your actual UUID
-- Get your user ID by running:
-- SELECT id FROM auth.users WHERE email = 'your@email.com';
-- 
-- Then replace all occurrences of '7a03d529-f20f-4430-be7e-d1a7a8720f29' with that UUID
-- =====================================================
