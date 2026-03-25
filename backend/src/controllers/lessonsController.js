import prisma from '../prisma.js';

export const getLessons = async (req, res) => {
  const { subject, level } = req.query;
  const where = {};
  if (subject) where.subject = subject.toUpperCase();
  if (level) where.level = level;
  try {
    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
      select: { id: true, slug: true, title: true, description: true, level: true, subject: true, order: true },
    });
    return res.json({ lessons });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

export const getLesson = async (req, res) => {
  const { slug } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({ where: { slug } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    return res.json({ lesson });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lesson' });
  }
};
