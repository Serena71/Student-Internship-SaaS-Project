export const citizenship = [
  { id: 1, label: 'Australian Citizen' },
  { id: 2, label: 'Australian PR' },
  { id: 3, label: 'New Zealand Citizen' },
  { id: 4, label: ' New Zealand PR' },
  { id: 5, label: ' Working Visa Holder' },
  { id: 6, label: ' International Students' },
];

export const fields = [
  { id: 1, label: 'Information Technology' },
  { id: 2, label: 'Law' },
  { id: 3, label: 'Science' },
  { id: 4, label: ' Statistics' },
  { id: 5, label: ' Medicine' },
  { id: 6, label: ' Engineering' },
];

export const jobs = [
  {
    jobID: 1,
    title: 'Web Developer',
    company: 'Google',
    authorID: 123,
    region: {
      country: 'Australia',
      state: 'NSW',
      city: 'Sydney',
    },
    field: 'Information Technology',
    citizenship: ['Australian PR', 'Australian Citizen'],
    description:
      'Computer science offers a sought-after, rewarding career path for tech-savvy people interested in the latest computer advancements. IT professionals who understand computer science trends remain competitive for the best career opportunities including artificial intelligence, Edge and quantum computing, cybersecurity, bio informatics and robotics.',
    meetings: [
      { date: '2022-07-21', time: '8:00 - 9:00', link: 'zoom-link-1' },
      { date: '2022-07-24', time: '8:00 - 9:00', link: 'zoom-link-2' },
    ],
  },
  {
    jobID: 2,
    title: 'Data Analysis',
    company: 'Microsoft',
    authorID: 321,
    region: {
      country: 'Australia',
      state: 'NSW',
      city: 'North Sydney',
    },
    citizenship: ['Australian PR', 'Australian Citizen'],
    description: 'This is a job description',
    meetings: [
      { date: '2022-07-22', time: '8:00 - 9:00', link: 'zoom-link-1' },
      { date: '2022-07-24', time: '8:00 - 9:00', link: 'zoom-link-2' },
    ],
  },
];