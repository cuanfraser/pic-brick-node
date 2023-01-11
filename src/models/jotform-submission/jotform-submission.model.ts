import { model } from 'mongoose';
import { IJotformSubmission, jotformSubmissionSchema } from './jotform-submission.schema.js';

const JotformSubmission = model<IJotformSubmission>('JotformSubmission', jotformSubmissionSchema);

export { JotformSubmission };
