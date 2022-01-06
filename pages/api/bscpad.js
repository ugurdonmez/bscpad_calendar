export default function handler(req, res) {
  res.status(200).json(
    [{
      "title": "Wagyu Swap",
      "address": "0xe428127cc2055e5c9d756ddce356aa2bf8da379b",
      "network": "bsc",
      "claims" : [
        "21-10-07 15:00",
        "21-11-07 15:00",
        "21-12-07 15:00",
        "22-01-07 15:00"
      ]
    },
    {
      "title": "Atlantis Metaverse",
      "address": "0xe428127cc2055e5c9d756ddce356aa2bf8da379b",
      "network": "bsc",
      "claims" : [
        "22-01-08 15:00",
        "22-02-08 15:00",
        "22-03-08 15:00",
      ]
    }]
  )
}
