from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

from models import db,Order,User
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 400
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Vulnerable Endpoint: View or update order details without checking if the order belongs to current user
@app.route('/api/orders/<int:order_id>', methods=['GET', 'PUT'])
@jwt_required()
def manage_order(order_id):

    # Vulnerability: We do not verify that the order belongs to the current user!
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    if request.method == 'GET':
        # Any authenticated user can view this order, regardless of who owns it
        order_data = {
            'id': order.id,
            'item_name': order.item_name,
            'quantity': order.quantity,
            'price': order.price,
            'shipping_address': order.shipping_address,
            'payment_status': order.payment_status,
            'user_id': order.user_id
        }
        return jsonify(order_data), 200

    if request.method == 'PUT':
        # Any authenticated user can update this order simply by knowing the order_id
        data = request.get_json()
        order.shipping_address = data.get('shipping_address', order.shipping_address)
        order.payment_status = data.get('payment_status', order.payment_status)
        db.session.commit()
        return jsonify({'message': 'Order updated successfully'}), 200

# Endpoint to create a new order for the authenticated user
@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_order = Order(
        item_name=data.get('item_name'),
        quantity=data.get('quantity', 1),
        price=data.get('price', 0.0),
        shipping_address=data.get('shipping_address', 'N/A'),
        payment_status=data.get('payment_status', 'Pending'),
        user_id=current_user_id
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({'message': 'Order created successfully', 'order_id': new_order.id}), 201

# Endpoint to get all orders 
@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user_id).all()
    orders_data = [{
        'id': o.id,
        'item_name': o.item_name,
        'quantity': o.quantity,
        'price': o.price,
        'shipping_address': o.shipping_address,
        'payment_status': o.payment_status,
        'user_id': o.user_id
    } for o in orders]
    return jsonify({'orders': orders_data}), 200


if __name__ == '__main__':
    app.run(debug=True)
