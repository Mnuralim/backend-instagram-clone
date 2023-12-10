import dotenv from 'dotenv'
import app from './app'
import { db } from './config/db'

dotenv.config()

const port = process.env.PORT ?? 5000

void db()

app.listen(port, () => { console.log(`Server is running on port ${port}`) })
