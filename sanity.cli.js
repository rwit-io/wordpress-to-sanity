import {defineCliConfig} from 'sanity/cli'
const dotenv = require('dotenv');
dotenv.config();

export default defineCliConfig({
  api: {
    projectId: process.env.PROJECT_ID,
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
