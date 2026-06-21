import fetch from 'node-fetch';

async function test() {
  try {
    const url = 'https://res.cloudinary.com/ddrife5n3/raw/upload/v1781540487/backpack_general/test_pdf_spoofed.dat';
    const res = await fetch(url);
    console.log("Status:", res.status);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("Buffer size:", buffer.length);
  } catch (err) {
    console.error(err);
  }
}

test();
