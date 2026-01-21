import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class CommunicationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    async getStudentNotifications(userId: string) {
        const notifications = await this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { fechaCreacion: 'DESC' },
        });

        return notifications.map(notif => ({
            id: notif.id,
            mensaje: notif.mensaje,
            leida: notif.leida,
            fecha: notif.fechaCreacion.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            })
        }));
    }

    async markAsRead(notificationId: string) {
        const notification = await this.notificationRepository.findOneBy({ id: notificationId });
        if (!notification) throw new NotFoundException('Notificación no encontrada');

        notification.leida = true;
        return this.notificationRepository.save(notification);
    }
}