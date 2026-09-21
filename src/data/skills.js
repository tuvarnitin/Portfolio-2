import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaBootstrap,
} from 'react-icons/fa';
import {
  SiExpress, SiMongodb, SiRedux, SiTailwindcss, SiSocketdotio,
  SiPassport, SiCloudinary, SiVercel, SiPostman,
} from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

export const skillCategories = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
  { id: 'deployment', label: 'Deployment' },
];

export const skills = [
  { name: 'HTML5', icon: FaHtml5, category: 'frontend', proficiency: 95, color: '#E34F26' },
  { name: 'CSS3', icon: FaCss3Alt, category: 'frontend', proficiency: 90, color: '#1572B6' },
  { name: 'JavaScript', icon: FaJs, category: 'frontend', proficiency: 90, color: '#F7DF1E' },
  { name: 'React', icon: FaReact, category: 'frontend', proficiency: 88, color: '#61DAFB' },
  { name: 'Redux Toolkit', icon: SiRedux, category: 'frontend', proficiency: 82, color: '#764ABC' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, category: 'frontend', proficiency: 88, color: '#06B6D4' },
  { name: 'Bootstrap', icon: FaBootstrap, category: 'frontend', proficiency: 80, color: '#7952B3' },
  { name: 'Node.js', icon: FaNodeJs, category: 'backend', proficiency: 85, color: '#339933' },
  { name: 'Express.js', icon: SiExpress, category: 'backend', proficiency: 85, color: '#FFFFFF' },
  { name: 'REST APIs', icon: TbApi, category: 'backend', proficiency: 88, color: '#009688' },
  { name: 'Socket.io', icon: SiSocketdotio, category: 'backend', proficiency: 70, color: '#ffffff' },
  { name: 'Passport.js', icon: SiPassport, category: 'backend', proficiency: 78, color: '#34E27A' },
  { name: 'MongoDB', icon: SiMongodb, category: 'database', proficiency: 85, color: '#47A248' },
  { name: 'Cloudinary', icon: SiCloudinary, category: 'tools', proficiency: 75, color: '#3448C5' },
  { name: 'Git', icon: FaGitAlt, category: 'tools', proficiency: 85, color: '#F05032' },
  { name: 'GitHub', icon: FaGithub, category: 'tools', proficiency: 88, color: '#FFFFFF' },
  { name: 'Postman', icon: SiPostman, category: 'tools', proficiency: 80, color: '#FF6C37' },
  { name: 'Vercel', icon: SiVercel, category: 'deployment', proficiency: 82, color: '#FFFFFF', fillColor:"#000000" },
];
