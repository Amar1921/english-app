import prisma from '../prisma.js';

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



export const getLessons = async (req, res) => {
  const { subject, level } = req.query;
  const where = {};
  if (subject) where.subject = subject.toUpperCase();
  if (level) where.level = level;
  try {
    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ level: 'asc' }, { orderLesson: 'asc' }],  // ← orderLesson
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        level: true,
        subject: true,
        orderLesson: true,  // ← orderLesson
      },
    });
    return res.json({ lessons });
  } catch (err) {
    console.error(err);  // ← ajoute ça pour voir l'erreur réelle
    return res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};