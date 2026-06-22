fetch('https://viscaree.com.br/api/admin/check-config')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
