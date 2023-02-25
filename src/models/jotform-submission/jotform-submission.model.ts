import { model } from 'mongoose';
import { IJotformSubmission, jotformSubmissionSchema } from './jotform-submission.schema.js';

export const JotformSubmissionModel = model<IJotformSubmission>('JotformSubmission', jotformSubmissionSchema);