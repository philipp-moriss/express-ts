import { PrismaClient, UserModal } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IPrismaService } from './prisma.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService implements IPrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Client Connect');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`[PrismaService] Error Connect : ${e.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.$disconnect();
			this.logger.log('[PrismaService] Client Disconnect');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`[PrismaService] Error Disconnect : ${e.message}`);
			}
		}
	}
}
