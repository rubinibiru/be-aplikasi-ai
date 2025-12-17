const materi = require("../data/materi.json");

exports.getMateri = (req, res) => {
  res.json(materi);
};
