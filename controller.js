export const test = (req, res) => {
    console.log('Contrôleur appelé');
    res.status(201).send('Hello');
};