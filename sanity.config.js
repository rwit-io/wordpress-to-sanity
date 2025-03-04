import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
const dotenv = require('dotenv');
dotenv.config();

export default defineConfig({
  name: 'default',
  title: 'Sanity WordPress',

  projectId: process.env.PROJECT_ID,
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
