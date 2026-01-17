"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Check, Clock, PackageCheck, X, Phone, Mail, Calendar, MapPin, FileText } from "lucide-react";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    companyName?: string;
    notes?: string;
    hasOwnCreatives: boolean;
    needsDesignHelp: boolean;
    createdAt: string;
    items: Array<{
        id: string;
        panel: {
            id: string;
            name: string;
            type: string;
            city: string;
            district: string;
            imageUrl?: string;
        };
        weeklyPrice: number;
        startDate: string;
        endDate: string;
    }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    REVIEWING: { label: 'İnceleniyor', color: 'bg-blue-100 text-blue-800', icon: Eye },
    APPROVED: { label: 'Onaylandı', color: 'bg-green-100 text-green-800', icon: Check },
    IN_PROGRESS: { label: 'Üretimde', color: 'bg-purple-100 text-purple-800', icon: PackageCheck },
    COMPLETED: { label: 'Tamamlandı', color: 'bg-gray-100 text-gray-800', icon: Check },
    CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800', icon: X }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]); // For extracting unique cities
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [cityFilter, setCityFilter] = useState<string>('');
    const [uniqueCities, setUniqueCities] = useState<string[]>([]);
    const [assignedCity, setAssignedCity] = useState<string | null>(null);

    // Fetch session to check if regional admin
    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setAssignedCity(data.user?.assignedCity || null);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        }
        fetchSession();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    // Filter orders by city (client-side for performance)
    const filteredOrders = cityFilter
        ? orders.filter(order => order.items.some(item => item.panel.city === cityFilter))
        : orders;

    const fetchOrders = async () => {
        try {
            const url = statusFilter
                ? `/api/admin/orders?status=${statusFilter}`
                : '/api/admin/orders';
            const res = await fetch(url);
            const data = await res.json();
            const fetchedOrders = data.orders || [];
            setOrders(fetchedOrders);
            setAllOrders(fetchedOrders);

            // Extract unique cities from all orders
            const cities = new Set<string>();
            fetchedOrders.forEach((order: Order) => {
                order.items.forEach(item => {
                    if (item.panel.city) {
                        cities.add(item.panel.city);
                    }
                });
            });
            setUniqueCities(Array.from(cities).sort());
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('tr-TR');
    const formatCurrency = (price: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);

    const calculateTotal = (items: Order['items']) => {
        return items.reduce((sum, item) => {
            const weeks = Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
            return sum + (item.weeklyPrice * Math.max(1, weeks));
        }, 0);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
                    <p className="text-slate-600">Müşteri siparişlerini yönetin</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    {/* City Filter - Only show for ADMIN (not regional admin) */}
                    {!assignedCity && uniqueCities.length > 0 && (
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg"
                        >
                            <option value="">Tüm İller</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    )}

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg"
                    >
                        <option value="">Tüm Durumlar</option>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Yükleniyor...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Henüz sipariş yok</h3>
                        </div>
                    ) : (
                        filteredOrders.map(order => {
                            const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
                            return (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-sm text-slate-500">{order.orderNumber}</p>
                                            <h3 className="font-semibold text-slate-900">{order.campaignName}</h3>
                                            <p className="text-sm text-slate-600">{order.contactName}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[order.status]?.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {STATUS_CONFIG[order.status]?.label}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-slate-500">
                                            <span>{order.items.length} pano</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <span className="font-semibold text-green-600">{formatCurrency(calculateTotal(order.items))}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Order Detail */}
                <div className="lg:col-span-1">
                    {selectedOrder ? (
                        <div className="bg-white rounded-xl border p-6 sticky top-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-500">{selectedOrder.orderNumber}</p>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedOrder.campaignName}</h2>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Update */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Durum Güncelle</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h3 className="font-medium text-slate-900 mb-2">İletişim</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <a href={`tel:${selectedOrder.contactPhone}`} className="text-blue-600 hover:underline">
                                            {selectedOrder.contactPhone}
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <a href={`mailto:${selectedOrder.contactEmail}`} className="text-blue-600 hover:underline">
                                            {selectedOrder.contactEmail}
                                        </a>
                                    </p>
                                    {selectedOrder.companyName && (
                                        <p className="text-slate-600">{selectedOrder.companyName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Creative Status */}
                            <div className={`rounded-lg p-4 ${selectedOrder.needsDesignHelp ? 'bg-purple-50' : 'bg-blue-50'}`}>
                                <h3 className="font-medium mb-1">
                                    {selectedOrder.needsDesignHelp ? '🎨 Tasarım Desteği İstiyor' : '📁 Görseller Hazır'}
                                </h3>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-medium text-slate-900 mb-2">Panolar ({selectedOrder.items.length})</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedOrder.items.map(item => (
                                        <div key={item.id} className="text-sm bg-slate-50 rounded p-2">
                                            <p className="font-medium">{item.panel.name}</p>
                                            <p className="text-slate-500">{item.panel.city} - {PANEL_TYPE_LABELS[item.panel.type as keyof typeof PANEL_TYPE_LABELS]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <h3 className="font-medium text-yellow-900 mb-1">Notlar</h3>
                                    <p className="text-sm text-yellow-800">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Toplam</span>
                                    <span className="text-green-600">{formatCurrency(calculateTotal(selectedOrder.items))}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
                            <Eye className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                            <p>Detay görüntülemek için bir sipariş seçin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
