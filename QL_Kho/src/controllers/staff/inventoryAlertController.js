const pool = require('../../config/db');
const convertNumberToWords = (num) => {
    // Copy nội dung hàm convertNumberToWords từ client-side vào đây
    if (isNaN(num) || num < 0) return 'Invalid';
    if (num === 0) return 'No coin';

    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion'];

    function convertChunk(chunk) {
        if (chunk === 0) return '';
        let str = '';
        const hundred = Math.floor(chunk / 100);
        const remainder = chunk % 100;

        if (hundred > 0) {
            str += units[hundred] + ' hundred ';
        }

        if (remainder > 0) {
            if (remainder < 10) {
                str += units[remainder];
            } else if (remainder < 20) {
                str += teens[remainder - 10];
            } else {
                const ten = Math.floor(remainder / 10);
                const unit = remainder % 10;
                str += tens[ten];
                if (unit > 0) {
                    str += ' ' + (unit === 1 ? 'mốt' : units[unit]);
                }
            }
        }

        return str.trim();
    }

    let words = '';
    let scaleIndex = 0;
    let firstChunk = true;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
            let chunkWords = convertChunk(chunk);
            if (scaleIndex > 0) {
                chunkWords += ' ' + scales[scaleIndex];
            }
            words = chunkWords + (firstChunk ? '' : ' ') + words;
            firstChunk = false;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    return words ? words + ' dong' : '';
};
const inventoryAlertController = {
    /**
     * Lấy danh sách tồn kho cảnh báo
     */
    getInventoryAlerts: async (req, res) => {
        try {
            // Lấy giá trị threshold từ query parameters, mặc định là 3000000000 nếu không có
            const threshold = req.query.threshold ? Number(req.query.threshold) : 3000000000;

            const [products] = await pool.query(`
                SELECT 
                  p.id,
                  p.product_code,
                  p.name,
                  p.quantity,
                  p.unit,
                  p.price,
                  (p.quantity * p.price) as total_value,
                  u.username as created_by
                FROM products p
                JOIN users u ON p.created_by = u.id
                WHERE (p.quantity * p.price) > ?
                ORDER BY total_value DESC
            `, [threshold]);

            res.render('staff/inventoryAlerts', {
                products,
                threshold,
                convertNumberToWords,
                helpers: {
                    formatCurrency: (value) => new Intl.NumberFormat('vi-VN').format(value)
                }
            });
        } catch (error) {
            console.error('Error getting inventory list:', error);
            res.render('staff/inventoryAlerts', {
                products: [],
                threshold: req.query.threshold || 3000000000,
                convertNumberToWords: () => ''
            });
        }
    },

    getExhaustedProducts: async (req, res) => {
        try {
            // Tương tự cho exhaustedProducts, có thể thêm threshold nếu cần
            const threshold = req.query.threshold ? Number(req.query.threshold) : 10;

            const [products] = await pool.query(`
                SELECT 
                  id,
                  product_code,
                  name,
                  quantity,
                  unit,
                  price
                FROM products 
                WHERE quantity < ?
                ORDER BY quantity DESC
            `, [threshold]);

            res.render('staff/exhaustedProducts', {
                products,
                threshold,
                helpers: {
                    formatCurrency: (value) => new Intl.NumberFormat('vi-VN').format(value)
                }
            });
        } catch (error) {
            console.error('Error getting list of almost out of stock:', error);
            res.render('staff/exhaustedProducts', {
                products: [],
                threshold: req.query.threshold || 10
            });
        }
    }
};

module.exports = inventoryAlertController;