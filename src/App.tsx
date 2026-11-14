import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import ColorsPage from '@/pages/ColorsPage';
import ContactPage from '@/pages/ContactPage';
import ExperiencePage from '@/pages/ExperiencePage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProjectsPage from '@/pages/ProjectsPage';
import TagPage from '@/pages/TagPage';
import TagsPage from '@/pages/TagsPage';

const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/colors" element={<ColorsPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/tags/:tag" element={<TagPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
