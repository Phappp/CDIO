const pool = require('../../config/db');
const path = require('path');
const ExcelJS = require('exceljs');
const { PassThrough } = require('stream');
const PDFDocument = require('pdfkit-table');

const reportController = {
    /**
     * Lấy danh sách báo cáo đã được xử lý
     * @param {string} status - Trạng thái lọc (all|approved|rejected|pending)
     */
    listProcessedReports: async (req, res) => {
        try {
            const { status = 'all', day, month, year } = req.query;
            const validStatuses = ['approved', 'rejected', 'pending'];

            // Xây dựng điều kiện WHERE
            let whereClause = '';
            if (status !== 'all' && validStatuses.includes(status)) {
                whereClause = `WHERE r.status = '${status}'`;
            } else {
                whereClause = `WHERE r.status IN ('approved', 'rejected')`; // Mặc định không hiển thị pending
            }

            // Truy vấn dữ liệu
            const [reports] = await pool.query(`
        SELECT 
          r.id,
          r.type,
          r.quantity,
          r.status,
          r.notes,
          r.created_at,
          r.updated_at,
          p.name as product_name,
          p.price,
          p.product_code,
          uc.username as creator_name,
          up.username as processor_name
        FROM reports r
        JOIN products p ON r.product_id = p.id
        JOIN users uc ON r.created_by = uc.id
        LEFT JOIN users up ON r.approved_by = up.id
        ${buildWhereClause(status, day, month, year)}
        ORDER BY r.updated_at DESC
        LIMIT 1000
      `);

            // Thống kê số lượng
            const [counts] = await pool.query(`
        SELECT 
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count
        FROM reports
      `);

            res.render('manager/processedReports', {
                reports,
                counts: counts[0],
                currentFilter: status,
                selectedDay: req.query.day || '',
                selectedMonth: req.query.month || '',
                selectedYear: req.query.year || '',
                helpers: {
                    formatDate: (date) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
                    calculateValue: (quantity, price) => (quantity * price).toLocaleString('vi-VN')
                }
            });

        } catch (error) {
            console.error('Lỗi truy vấn báo cáo:', error);
            res.render('manager/processedReports', {
                reports: [],
                counts: { approved_count: 0, rejected_count: 0, pending_count: 0 },
                currentFilter: 'all'
            });
        }
    },

    /**
     * Xử lý duyệt/từ chối báo cáo
     */
    processReport: async (req, res) => {
        try {
            const { id } = req.params;
            const { action } = req.body;
            const processorId = req.user.id;

            if (!['approve', 'reject'].includes(action)) {
                return res.status(400).json({ error: 'Hành động không hợp lệ' });
            }

            await pool.query(`
        UPDATE reports 
        SET 
          status = ?,
          approved_by = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [action === 'approve' ? 'approved' : 'rejected', processorId, id]);

            res.redirect('/manager/reports/processed');

        } catch (error) {
            console.error('Lỗi xử lý báo cáo:', error);
            res.status(500).json({ error: 'Lỗi server khi xử lý báo cáo' });
        }
    },
    /**
   * Xuất báo cáo Excel
   */
    exportExcel: async (req, res) => {
        try {
            const { status = 'all', day, month, year } = req.query;

            // Lấy dữ liệu (tương tự listProcessedReports)
            const [reports] = await pool.query(`
        SELECT 
              r.id,
              r.type,
              r.quantity,
              r.status,
              r.notes,
              r.created_at,
              r.updated_at,
              p.name as product_name,
              p.price,
              p.product_code,
              uc.username as creator_name,
              up.username as processor_name
            FROM reports r
            JOIN products p ON r.product_id = p.id
            JOIN users uc ON r.created_by = uc.id
            LEFT JOIN users up ON r.approved_by = up.id
            ${buildWhereClause(status, day, month, year)}  
            ORDER BY r.updated_at DESC
            LIMIT 1000
      `);

            // Tạo workbook Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo cáo');

            // Định dạng header
            worksheet.columns = [
                { header: 'Mã BC', key: 'id', width: 10 },
                { header: 'Loại', key: 'type', width: 10 },
                { header: 'Mã SP', key: 'product_code', width: 15 },
                { header: 'Tên SP', key: 'product_name', width: 30 },
                { header: 'SL', key: 'quantity', width: 10 },
                { header: 'Đơn giá', key: 'price', width: 15, style: { numFmt: '#,##0' } },
                { header: 'Thành tiền', key: 'total', width: 15, style: { numFmt: '#,##0' } },
                { header: 'Trạng thái', key: 'status', width: 15 },
                { header: 'Người tạo', key: 'creator_name', width: 20 },
                { header: 'Ngày tạo', key: 'created_at', width: 20 }
            ];

            // Thêm dữ liệu
            reports.forEach(report => {
                worksheet.addRow({
                    ...report,
                    type: report.type === 'import' ? 'Nhập' : 'Xuất',
                    status: formatStatus(report.status),
                    total: report.quantity * report.price,
                    created_at: new Date(report.created_at).toLocaleString('vi-VN')
                });
            });

            // Thiết lập response
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=bao_cao_${new Date().toISOString().split('T')[0]}.xlsx`
            );

            // Ghi file
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error('Lỗi xuất Excel:', error);
            res.status(500).send('Lỗi khi xuất file Excel');
        }
    },

    /**
     * Xuất báo cáo PDF
     */
    exportPDF: async (req, res) => {
        try {
            const { status = 'all', day, month, year } = req.query;
            const [reports] = await pool.query(`
                SELECT 
                    r.id, r.type, r.quantity, r.status, r.notes, r.created_at,
                    r.updated_at, p.name as product_name, p.price, p.product_code,
                    uc.username as creator_name, up.username as processor_name
                FROM reports r
                JOIN products p ON r.product_id = p.id
                JOIN users uc ON r.created_by = uc.id
                LEFT JOIN users up ON r.approved_by = up.id
                ${buildWhereClause(status, day, month, year)}  
                ORDER BY r.updated_at DESC
                LIMIT 1000
            `);

            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const stream = new PassThrough();
            // 👉 Đăng ký và set font Roboto tại đây
            const fontPath = path.join(__dirname, '../../../public/fonts/Roboto-Regular.ttf');
            doc.registerFont('Roboto', fontPath);
            doc.font('Roboto'); // phải gọi trước khi viết text

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=bao_cao_${new Date().toISOString().split('T')[0]}.pdf`
            );

            doc.pipe(stream);

            // Tiêu đề
            doc.fontSize(16).text('BÁO CÁO NHẬP/XUẤT', { align: 'center' });
            doc.fontSize(10).text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
            doc.moveDown(1.5);

            // Tạo bảng
            const table = {
                headers: [
                    { label: 'Mã BC', property: 'id', width: 40, renderer: null },
                    { label: 'Loại', property: 'type', width: 50 },
                    { label: 'Mã SP', property: 'product_code', width: 60 },
                    { label: 'Tên SP', property: 'product_name', width: 100 },
                    { label: 'SL', property: 'quantity', width: 30 },
                    { label: 'Đơn giá', property: 'price', width: 60 },
                    { label: 'Thành tiền', property: 'total', width: 70 },
                    { label: 'Trạng thái', property: 'status', width: 60 },
                    { label: 'Ngày tạo', property: 'created_at', width: 90 },
                ],
                datas: reports.map(r => ({
                    id: r.id,
                    type: r.type === 'import' ? 'Nhập' : 'Xuất',
                    product_code: r.product_code,
                    product_name: r.product_name,
                    quantity: r.quantity,
                    price: formatCurrency(r.price),
                    total: formatCurrency(r.price * r.quantity),
                    status: formatStatus(r.status),
                    created_at: new Date(r.created_at).toLocaleString('vi-VN')
                })),
            };

            await doc.table(table, {
                prepareHeader: () => doc.fontSize(9),
                prepareRow: (row, i) => doc.fontSize(8)
            });

            doc.end();
            stream.pipe(res);

        } catch (error) {
            console.error('Lỗi xuất PDF:', error);
            res.status(500).send('Lỗi khi xuất file PDF');
        }
    }
};
// Hàm hỗ trợ
function buildWhereClause(status, day, month, year) {
    let clauses = [];

    if (status === 'all') {
        clauses.push("r.status IN ('approved', 'rejected')");
    } else {
        clauses.push(`r.status = '${status}'`);
    }

    if (year) {
        clauses.push(`YEAR(r.created_at) = ${parseInt(year)}`);
    }
    if (month) {
        clauses.push(`MONTH(r.created_at) = ${parseInt(month)}`);
    }
    if (day) {
        clauses.push(`DAY(r.created_at) = ${parseInt(day)}`);
    }

    return clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '';
}


function formatStatus(status) {
    const statusMap = {
        approved: 'Đã duyệt',
        rejected: 'Từ chối',
        pending: 'Chờ xử lý'
    };
    return statusMap[status] || status;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

module.exports = reportController;