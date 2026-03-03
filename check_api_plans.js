
import http from 'http';

http.get('http://localhost:8080/api/public/plans', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log("Plans from API:");
        console.log(data);
        process.exit(0);
    });
}).on('error', (err) => {
    console.error("Error calling API:", err.message);
    process.exit(1);
});
