import { Schema, model, models, Types } from 'mongoose';

export interface IAuthorizedDomain {
  domain: string;
  organizationName?: string;
  adminId: Types.ObjectId;
  coAdminIds?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const authorizedDomainSchema = new Schema<IAuthorizedDomain>(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    coAdminIds: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

const AuthorizedDomain = models?.AuthorizedDomain || model<IAuthorizedDomain>('AuthorizedDomain', authorizedDomainSchema);

export default AuthorizedDomain;
